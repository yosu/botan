import React, { useEffect } from "react"
import { Link } from "react-router";
import { allNoteSet, selectAllNote } from "./noteSlice";
import { useDispatch, useSelector } from "react-redux";
import { parseISO } from "date-fns"

export const NoteList = ({ bookId }) => {
  const dispatch = useDispatch();
  const notes = useSelector(selectAllNote)

  useEffect(() => {
    (async () => {
      const resp = await fetch(`/api/notes?book_id=${bookId}`);
      if (!resp.ok) {
        throw new Error(`レスポンスステータス: ${resp.status}`)
      }

      const json = await resp.json()
      dispatch(allNoteSet(json.data))
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
        <UpdatedAt timestamp={note.updated_at}/>
      </div>
    </Link>
  );
}

const UpdatedAt = ({ timestamp }) => {
  const date = parseISO(timestamp)
  const dateStr = date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).replaceAll('/', '-')

  return (
    <time dateTime="timestamp" title={timestamp}>
      <span className="text-sm text-gray-600">&nbsp;{dateStr}</span>
    </time>
  )
}
