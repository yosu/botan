import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookTree, useBookTree } from "./BookTree"
import { createNewBook, deleteBook, SelectAllBooks } from "./bookSlice";
import Modal from "react-modal"
import { ContextMenu, ContextMenuProvider, MenuItem, useContextMenu } from "./components/ContextMenu";
import { getNoteListByBookId } from "../api/note";
import { Button } from "./components/Button";

const modalStyles = {
  content: {
    top: "20%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    minWidth: "50%",
    maxWidth: "50%",
  },
};

const NotebooksBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("")
  const [createButtonDisabled, setCreateButtonDisabled] = useState(true)
  const dispatch = useDispatch();

  const handleChangeName = (e) => {
    setName(e.target.value)
  }

  const closeModal = () => {
    setName("")
    setIsOpen(false)
  }

  useEffect(() => {
    setCreateButtonDisabled(name === "");
  }, [name])

  const handleCreateNewNotebook = useCallback(() => {
    dispatch(createNewBook(name))
      .unwrap()
      .then(() => {
        closeModal(true)
      })
  }, [name])

  return (
    <>
      <div className="border-b py-1 border-white flex">
        <span className="flex-1 text-center truncate">Notebooks</span>
        <span className="flex-none mr-2 cursor-pointer hero-plus-circle text-gray-400" onClick={() => setIsOpen(true)} />
      </div>
      <Modal style={modalStyles} isOpen={isOpen} ariaHideApp={false} >
        <h3 className="text-lg font-semibold mb-2">Add New Notebook</h3>
        <input
          id="notebook-input"
          type="text"
          placeholder="Enter notebook name"
          className="w-full"
          autoFocus={true}
          value={name}
          onChange={handleChangeName}
        />
        <div className="mt-4">
          <Button type="button" onClick={closeModal} className="bg-zinc-400 hover:bg-zinc-500">Cancel</Button>
          <Button type="button"
            disabled={createButtonDisabled}
            onClick={handleCreateNewNotebook}
            className="ml-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-400">
            Create
          </Button>
        </div>
      </Modal>
    </>
  )
}

export const BookList = () => {
  const books = useSelector(SelectAllBooks);
  const bookTree = useBookTree(books);
  const [canDelete, setCanDelete] = useState(true);
  const dispatch = useDispatch()

  const onOpenContextMenu = async ({ bookId }) => {
    const notes = await getNoteListByBookId(bookId)
    setCanDelete(notes.length === 0)
  }

  const { x, y, isOpen, onContextMenu, menuContext } = useContextMenu(onOpenContextMenu)

  const handleMenu = (menuId) => {
    const { bookId } = menuContext;

    switch (menuId) {
      case "rename-notebook":
        console.log(`${bookId} の名前を変更`)
        break;
      case "delete-notebook":
        dispatch(deleteBook(bookId))
          .unwrap()
        break;
    }
  }

  return (
    <>
      <ContextMenu x={x} y={y} isOpen={isOpen}>
        <MenuItem menuId="rename-notebook" onClick={handleMenu}>ブック名を変更</MenuItem>
        <MenuItem menuId="delete-notebook" onClick={handleMenu} disabled={!canDelete}>ブックを削除</MenuItem>
      </ContextMenu>
      <NotebooksBar />
      <ContextMenuProvider onContextMenu={onContextMenu}>
        <BookTree books={bookTree} />
      </ContextMenuProvider>
    </>
  )
}
