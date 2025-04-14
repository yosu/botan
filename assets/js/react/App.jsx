import React from "react";
import { BookTree } from "./BookTree";
import { NoteList } from "./NoteList";
import { Note } from "./Note";
import { useParams } from "react-router";

const App = ({ props }) => {
  const { bookId, noteId } = useParams();

  return (
    <div id="wrapper" className="flex min-h-[calc(100vh-34px)]">
      <div id="books" className="bg-red-100 w-56 p-2">
        <BookTree books={props.books} />
      </div>
      <div id="notes" className="bg-orange-100 w-56">
        {bookId ? <NoteList bookId={bookId}/>: "No notebooks"}
      </div>
      <div id="content" className="bg-yellow-50 w-full">
        {noteId ? <Note noteId={noteId} /> : "No contents"}
      </div>
    </div>
  )
}

export default App;
