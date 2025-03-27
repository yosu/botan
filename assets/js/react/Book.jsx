import React, {useState, useCallback} from "react";
import { BookTree } from "./BookTree";

export const Book = ({ book }) => {
  return (
    book.children.length > 0 ? <ParentBook book={book} /> : <LeafBook book={book} />
  );
}

const LeafBook = ({ book }) => {
  return (
    <BookNameWrapper>
      <span className="p-2" /> {book.name}
    </BookNameWrapper>
  );
}

const ParentBook = ({ book }) => {
  const [open, setOpen] = useState(true);
  const toggleOpen = useCallback(() => {
    setOpen(!open);
  }, [open])

  return (
    <>
      <BookNameWrapper onClick={toggleOpen}>
        <span className="hover:text-zinc-400">{open ? "v" : ">"}</span> {book.name}
      </BookNameWrapper>
      {open &&
        <div className="ml-4">
              <BookTree books={book.children} />
        </div>
      }
    </>
  );
}

const BookNameWrapper = ({ onClick, children }) => {
  return (
    <div className="select-none text-nowrap cursor-pointer hover:bg-red-200" onClick={onClick}>
      {children}
    </div>
  );
}
