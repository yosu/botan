import React from "react";
import { useSelector } from "react-redux";
import { BookTree, useBookTree } from "./BookTree"
import { SelectAllBooks } from "./bookSlice";

export const BookList = () => {
  const books = useSelector(SelectAllBooks);
  const bookTree = useBookTree(books);

  return <BookTree books={bookTree} />
}
