import React, { useCallback, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router";
import { allNoteSet, createNewNote, selectAllNote, deleteNote } from "./noteSlice";
import { useDispatch, useSelector } from "react-redux";
import { parseISO } from "date-fns"
import classNames from "classnames";
import { selectBookById } from "./bookSlice";

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
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleKeyDown = (e) => {
    if (e.metaKey && e.code.toLowerCase() === "backspace") {
      dispatch(deleteNote(note.id))
        .unwrap()
        .then(() => {
          navigate(`/app/${note.bookId}`)
        })
    }
  }

  return (
    <Link to={`/app/${note.bookId}/${note.id}`} onKeyDown={handleKeyDown}>
      <div className={classNames(
        "p-1 border-b border-zinc-300 select-none cursor-pointer",
        isActive ? "bg-gray-300 hover:bg-gray-400" : "hover:bg-gray-300"
      )}>
        <h3 className={note.title ? "text-xs font-semibold" : "text-gray-600"}>{note.title || "Untitled"}</h3>
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
