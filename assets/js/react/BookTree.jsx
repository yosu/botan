import React, { useEffect, useState } from "react";
import { Book } from "./Book";
import groupBy from "just-group-by";

export const BookTree = ({ books }) => {
  return (
    books.map(book =>
      <div key={book.id}>
        <Book book={book} />
    </div>)
  );
}

function makeBookTree(books) {
    const groups = groupBy(books, (book) => book.parent_book_id)

    return (groups[null] || []).map((n) => associateChildren(n, groups)).sort((a, b) => a.name.localeCompare(b.name))
}

function associateChildren(node, groups) {
  const children = (groups[node.id] || []).map((n) => associateChildren(n, groups)).sort((a, b) => a.name.localeCompare(b.name))

  return Object.assign({ children }, node)
}

export const useBookTree = (books) => {
  const [bookTree, setBookTree] = useState([])

  useEffect(() => {
    const bt = makeBookTree(books)
    setBookTree(bt);
  }, [books]);

  return bookTree;
}
