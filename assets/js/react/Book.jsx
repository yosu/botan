import React, {useState, useCallback} from "react";
import { BookTree } from "./BookTree";
import { NavLink } from "react-router";

export const Book = ({ book }) => {
  return (
    book.children.length > 0 ? <ParentBook book={book} /> : <LeafBook book={book} />
  );
}

const LeafBook = ({ book }) => {
  return (
    <BookNameWrapper bookId={book.id}>
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
      <BookNameWrapper bookId={book.id} onClick={toggleOpen}>
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

const BookNameWrapper = ({ bookId, onClick, children }) => {
  return (
    <NavLink to={`/app/${bookId}`}>
      {
        ({ isActive }) => (
          isActive ?
          (
            <div className="select-none text-nowrap cursor-pointer bg-red-200  hover:bg-red-300" onClick={onClick}>
              {children}
            </div>
          )
            : (<div className="select-none text-nowrap cursor-pointer hover:bg-red-200" onClick={onClick}>
              {children}
            </div>)
        )
      }
    </NavLink>
  );
}
