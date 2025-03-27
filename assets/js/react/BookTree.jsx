import React from "react";
import { Book } from "./Book";

export const BookTree = ({ books }) => {
  return (
    books.map(book =>
      <div key={book.id}>
        <Book book={book} />
    </div>)
  );
}
