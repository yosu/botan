import { Editor, rootCtx, defaultValueCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { gfm } from "@milkdown/kit/preset/gfm";
import { history } from "@milkdown/kit/plugin/history";
import { indent } from "@milkdown/kit/plugin/indent";
import { listItemBlockComponent } from "@milkdown/kit/component/list-item-block";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { upload, uploadConfig } from "@milkdown/kit/plugin/upload";
import React, { useRef, useEffect } from "react";
import { updateBody } from "../api/note";

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

      console.log(image)
      fd.append("uploadfile", image);

      const res = await fetch('/file', {
        method: 'POST',
        headers: {
          'x-csrf-token': getCSRFToken()
        },
        body: fd
      });
      console.log(res);

      const json = await res.json();
      console.log(json);

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


const MilkdownEditor = ({ note }) => {
  const editorRef = useRef(null)

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
        })
        ctx.update(uploadConfig.key, (prev) => ({
          ...prev,
          uploader,
        }));
      })
      .use(commonmark)
      .use(gfm)
      .use(indent)
      .use(history)
      .use(listItemBlockComponent)
      .use(listener)
      .use(upload)

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

export const MilkdownEditorWrapper = ({ note }) => {
  return (
    <MilkdownProvider>
      <MilkdownEditor note={note} />
    </MilkdownProvider>
  );
}
