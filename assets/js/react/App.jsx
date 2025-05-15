import React, { useEffect } from "react";
import { useBookTree } from "./BookTree";
import { NoteList } from "./NoteList";
import { Note } from "./Note";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { allBookSet, SelectAllBooks } from "./bookSlice";
import { selectFirstNote } from "./noteSlice";
import { BookList } from "./BookList";

const useRidrectIfFirstNoteExist = (bookId, noteId) => {
  const navigate = useNavigate();
  const firstNote = useSelector(selectFirstNote);

  useEffect(() => {
    if (!noteId && firstNote && firstNote.bookId === bookId) {
      navigate(`/app/${bookId}/${firstNote.id}`)
    }

  }, [bookId, noteId, firstNote])
}

const App = ({ props }) => {
  const { bookId, noteId } = useParams();
  useRidrectIfFirstNoteExist(bookId, noteId);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allBookSet(props.books))
  }, [props.books])

  return (
    <div id="wrapper" className="flex min-h-[calc(100vh-34px)]">
      <div id="books" className="bg-red-100 p-2 w-56 h-screen overflow-y-auto">
        <BookList />
      </div>
      <div id="notes" className="bg-orange-100 w-56 h-screen overflow-y-auto">
        {bookId ? <NoteList bookId={bookId}/>: "No notebooks"}
      </div>
      <div id="content" className="bg-yellow-50 w-full h-screen overflow-y-auto">
        {noteId ? <Note noteId={noteId} /> : "No contents"}
      </div>
    </div>
  )
}

export default App;
