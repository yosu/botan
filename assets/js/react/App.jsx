import React from "react";
import { BookTree } from "./BookTree";
import { NoteList } from "./NoteList";
import { useParams } from "react-router";

const App = ({ props }) => {
  const { bookId } = useParams();

  return (
    <div id="wrapper" className="flex min-h-[calc(100vh-34px)]">
      <div id="books" className="bg-red-100 w-56 p-2">
        <BookTree books={props.books} />
      </div>
      <div id="notes" className="bg-orange-100 w-56">
        {bookId ? <NoteList bookId={bookId}/>: "No notebooks"}
      </div>
      <div id="content" className="bg-yellow-50 w-full">3 from React</div>
    </div>
  )
}

export default App;
