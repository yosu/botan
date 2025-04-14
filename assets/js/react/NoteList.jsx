import React, { useEffect, useState } from "react"
import { Link } from "react-router";

export const NoteList = ({ bookId }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    (async () => {
      const resp = await fetch(`/api/notes?book_id=${bookId}`);
      if (!resp.ok) {
        throw new Error(`レスポンスステータス: ${resp.status}`)
      }

      const json = await resp.json()
      setNotes(json.data)
    })()
  }, [bookId])

  return (
    <div>
      {notes.map((note) => <NoteTitle key={note.id} note={note} />)}
    </div>
  );
}


const NoteTitle = ({ note }) => {
  return (
    <Link to={`/app/${note.bookId}/${note.id}`}>
      <div className="border bottom-1 border-zinc-300">
        <h3 className="select-none cursor-pointer hover:bg-orange-200">{note.title}</h3>
      </div>
    </Link>
  );
}
