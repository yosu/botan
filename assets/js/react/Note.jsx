import React, {useEffect, useState} from "react";

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
      <pre>{note.body}</pre>
    </div>
  )
}
