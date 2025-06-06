import React, {useState, useCallback} from "react";
import { BookTree } from "./BookTree";
import { NavLink } from "react-router";
import classNames from "classnames";
import { useOnContextMenu } from "./components/ContextMenu";

export const Book = ({ book }) => {
  return (
    book.children?.length > 0
      ? <ParentBook book={book}/>
      : <LeafBook book={book}/>
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
        <span className={classNames("w-4 h-4", open ? "hero-chevron-down" : "hero-chevron-right")} />{book.name}
      </BookNameWrapper>
      {open &&
        <div className="ml-4">
          <BookTree books={book.children}/>
        </div>
      }
    </>
  );
}

const BookNameWrapper = ({ bookId, onClick, children }) => {
  const onContextMenu = useOnContextMenu()

  return (
    <NavLink to={`/app/${bookId}`}>
      {
        ({ isActive }) => (
          <div
            className={classNames("select-none text-nowrap cursor-pointer", isActive ? "bg-zinc-500 hover:bg-zinc-600" : "hover:bg-zinc-500")}
            onContextMenu={(e) => onContextMenu(e, { bookId })}
            onClick={onClick}>
            {children}
          </div>
        )
      }
    </NavLink>
  );
}
