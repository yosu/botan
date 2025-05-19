import React, { useCallback, useEffect, useRef, useState } from "react";
import { MilkdownEditorWrapper } from "./MilkdownEditorWrapper";
import { updateTitle } from "../api/note";
import { useDispatch, useSelector } from "react-redux";
import { noteTitleUpdated, selectNoteById } from "./noteSlice";

export const Note = ({ noteId }) => {
  const dispatch = useDispatch()
  const note = useSelector(state => selectNoteById(state, noteId))

  onChangeTitle = useCallback((e) => {
    updateTitle(note.id, e.target.value);
    dispatch(noteTitleUpdated({ id: note.id, title: e.target.value }))
  }, [note])

  const titleRef = useRef(null);

  useEffect(() => {
    if (note?.title === "" && note?.body === "") {
      titleRef.current?.focus()
    }
  }, [noteId])

  return (
    note &&
      <div>
        <input
          type="text"
          value={note.title}
          placeholder="Untitled"
          onChange={onChangeTitle}
          className="w-full bg-transparent border-none focus:ring-0"
          ref={titleRef}
        />
        <MilkdownEditorWrapper noteId={note.id} />
      </div>
  )
}
