import { Editor, rootCtx, defaultValueCtx, editorViewOptionsCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { gfm } from "@milkdown/kit/preset/gfm";
import { history } from "@milkdown/kit/plugin/history";
import { indent } from "@milkdown/kit/plugin/indent";
import { listItemBlockComponent } from "@milkdown/kit/component/list-item-block";
import { clipboard } from '@milkdown/kit/plugin/clipboard'
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { upload, uploadConfig } from "@milkdown/kit/plugin/upload";
import React, { useRef, useEffect, useState } from "react";
import { updateBody } from "../api/note";
import { getCSRFToken } from "../util/csrf";
import { defaultKeymap } from "@codemirror/commands"
import { basicSetup } from "codemirror"
import { languages } from "@codemirror/language-data";
import { keymap } from "@codemirror/view"
import { codeBlockComponent, codeBlockConfig } from "@milkdown/kit/component/code-block"
import { elixir } from "codemirror-lang-elixir"
import { useDispatch } from "react-redux";
import { noteTouched } from "./noteSlice";

const uploader = async (files, schema) => {
  const images = [];

  for (let i = 0; i < files.length; i++) {
    const file = files.item(i);
    if (!file) {
      continue;
    }

    // You can handle whatever the file type you want, we handle image here.
    if (!file.type.includes("image")) {
      continue;
    }

    images.push(file);
  }

  const nodes = await Promise.all(
    images.map(async (image) => {
      const fd = new FormData();

      fd.append("uploadfile", image);

      const res = await fetch('/file', {
        method: 'POST',
        headers: {
          'x-csrf-token': getCSRFToken()
        },
        body: fd
      });

      const json = await res.json();

      const src = json.data.url
      const alt = image.name;
      return schema.nodes.image.createAndFill({
        src,
        alt,
      });
    }),
  );

  return nodes;
};

// Open URL by new tab
// https://zenn.dev/rabee/articles/milkdown-click-event
const handleElementClick = (view, event) => {
  if (event.target.tagName.toLowerCase() === "a") {
    event.preventDefault()

    const href = event.target.getAttribute("href")
    window.open(href, "_blank")
  }
}


const MilkdownEditor = ({ note }) => {
  const editorRef = useRef(null)
  const dispatch = useDispatch()

  useEditor((root) => {
    editorRef.value = Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, note.body)
        ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
          // Avoid the error below:
          //   MilkdownError: Create prosemirror node from remark failed in parser
          replaced = markdown.replace(/\* <br \/>/g, "")
          updateBody(note.id, replaced)
          dispatch(noteTouched({ id: note.id }))
        })
        ctx.update(uploadConfig.key, (prev) => ({
          ...prev,
          uploader,
        }));
        ctx.set(editorViewOptionsCtx, {
          handleDOMEvents: {
            click: handleElementClick
          }
        })

        ctx.update(codeBlockConfig.key, (defaultConfig) => ({
          ...defaultConfig,
          languages,
          extensions: [basicSetup, keymap.of(defaultKeymap), elixir()],
        }))
      })
      .use(commonmark)
      .use(gfm)
      .use(indent)
      .use(history)
      .use(listItemBlockComponent)
      .use(listener)
      .use(upload)
      .use(clipboard) // paste url as a link
      .use(codeBlockComponent)

    editorRef.value.create();
  }, [note])

  useEffect(() => {
    return () => {
      if (editorRef.value) {
        editorRef.value.destroy();
        editorRef.value = null;
      }
    }
  }, [note])

  return <Milkdown />
}

export const MilkdownEditorWrapper = ({ noteId }) => {
  const [note, setNote] = useState(null)

  useEffect(() => {
    (async () => {
      const resp = await fetch(`/api/notes/${noteId}`)
      if (!resp.ok) {
        throw new Error(`レスポンスステータス: ${resp.status}`)
      }
      const json = await resp.json()
      setNote(json.data)
    })()
  }, [noteId])

  return (
    <MilkdownProvider>
      {note && <MilkdownEditor note={note} />}
    </MilkdownProvider>
  );
}
