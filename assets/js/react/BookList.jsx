import React from "react";
import { useSelector } from "react-redux";
import { BookTree, useBookTree } from "./BookTree"
import { SelectAllBooks } from "./bookSlice";

const NotebooksBar = () => {
  return (
    <div className="border-b py-1 border-white flex">
      <span className="flex-1 text-center truncate">Notebooks</span>
      <span className="flex-none mr-2 cursor-pointer hero-plus-circle text-gray-400" />
    </div>
  )
}

export const BookList = () => {
  const books = useSelector(SelectAllBooks);
  const bookTree = useBookTree(books);

  return (
    <>
      <NotebooksBar />
      <BookTree books={bookTree} />
    </>
  )
}
