import React, {useCallback, useEffect, useState} from "react";
import { MilkdownEditorWrapper } from "./MilkdownEditorWrapper";
import { debounce } from "../util/debounce";

const updateTitle = debounce((id, title) => {
    const fd = new FormData();
    fd.append("note[title]", title)

    fetch(`/api/notes/${id}`, {
      "method": "PATCH",
      "body": fd
    })

}, 1000)

export const Note = ({ noteId }) => {
  const [note, setNote] = useState(null)
  const [title, setTitle] = useState("");

  useEffect(() => {
    (async () => {
      const resp = await fetch(`/api/notes/${noteId}`);
      if (!resp.ok) {
        throw new Error(`レスポンスステータス: ${resp.status}`)
      }

      const json = await resp.json()
      setNote(json.data)
    })()
  }, [noteId])

  useEffect(() => {
    if (note) {
      setTitle(note.title);
    }
  },[note])

  onChangeTitle = useCallback((e) => {
    setTitle(e.target.value);
    updateTitle(note.id, e.target.value);
  }, [note])

  return (
    note &&
    <div>
      <input type="text" value={title} onChange={onChangeTitle} className="w-full bg-transparent border-none focus:ring-0"/>
      <MilkdownEditorWrapper value={note.body} />
    </div>
  )
}
