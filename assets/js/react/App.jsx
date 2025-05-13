import React, { useEffect } from "react";
import { BookTree, useBookTree } from "./BookTree";
import { NoteList } from "./NoteList";
import { Note } from "./Note";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { allBookSet, SelectAllBooks } from "./bookSlice";

const App = ({ props }) => {
  const { bookId, noteId } = useParams();
  const dispatch = useDispatch();
  const books = useSelector(SelectAllBooks)

  useEffect(() => {
    dispatch(allBookSet(props.books))
  }, [props.books])

  const bookTree = useBookTree(books)

  return (
    <div id="wrapper" className="flex min-h-[calc(100vh-34px)]">
      <div id="books" className="bg-red-100 p-2 w-56 h-screen overflow-y-auto">
        <BookTree books={bookTree} />
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
