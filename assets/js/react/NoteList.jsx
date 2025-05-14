import React, { useCallback, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router";
import { allNoteSet, createNewNote, selectAllNote } from "./noteSlice";
import { useDispatch, useSelector } from "react-redux";
import { parseISO } from "date-fns"
import classNames from "classnames";
import { selectBookById } from "./bookSlice";
import { createNote } from "../api/note";

const useIsActiveNote = () => {
  const { noteId: selectedNoteId } = useParams();

  const isActiveNote = useCallback((note) => {

    return note.id === selectedNoteId;
  }, [selectedNoteId])

  return isActiveNote;
}

export const NoteList = ({ bookId }) => {
  const dispatch = useDispatch();
  const notes = useSelector(selectAllNote)
  const isActiveNote = useIsActiveNote()

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
      <BookTitleBar bookId={bookId} />
      <div>
        {notes.map((note) => <NoteTitle key={note.id} note={note} isActive={isActiveNote(note)} />)}
      </div>
    </div>
  );
}

const BookTitleBar = ({ bookId }) => {
  const dispatch = useDispatch()
  const book = useSelector(state => selectBookById(state, bookId))

  const navigate = useNavigate()

  const handleNewNote = useCallback(async () => {
    dispatch(createNewNote(bookId))
      .unwrap()
      .then((note) => {
        navigate(`/app/${note.bookId}/${note.id}`)
      })
  }, [bookId])


  if (!book) return null;

  return (
    <div className="py-1 border-b border-white flex">
      <span className="flex-1 text-center truncate">{book.name}</span>
      <span className="flex-none mr-2 cursor-pointer hero-pencil-square text-gray-400" onClick={handleNewNote}/>
    </div>
  )
}

const NoteTitle = ({ note, isActive }) => {
  return (
    <Link to={`/app/${note.bookId}/${note.id}`}>
      <div className={classNames(
        "border-b border-zinc-300 select-none cursor-pointer",
        isActive ? "bg-orange-200 hover:bg-orange-300" : "hover:bg-orange-200"
      )}>
        <h3>{note.title}</h3>
        <UpdatedAt timestamp={note.updatedAt}/>
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
