import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BookTree, useBookTree } from "./BookTree"
import { SelectAllBooks } from "./bookSlice";
import Modal from "react-modal"
import classNames from "classnames";

// TODO: create 'components' directory and move to the directory
const Button = ({ children, onClick, className, disabled }) => {
  return (
    <button
      type="button"
      className={classNames(
        "rounded-lg bg-zinc-900 hover:bg-zinc-700 py-2 px-3",
        "text-sm font-semibold leading-6 text-white active:text-white/80",
        className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

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

  const handleCreateNewNotebook = () => {
    console.log("Create: ", name)
    closeModal(true)
  }

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

  return (
    <>
      <NotebooksBar />
      <BookTree books={bookTree} />
    </>
  )
}
