import React, {useEffect, useState} from "react";
import { MilkdownEditorWrapper } from "./MilkdownEditorWrapper";

export const Note = ({ noteId }) => {
  const [note, setNote] = useState(null)

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

  return (
    note &&
    <div>
      <h2>{note.title}</h2>
      <MilkdownEditorWrapper value={note.body} />
    </div>
  )
}
