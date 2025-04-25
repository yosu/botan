import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

// TODO: Add sort comparer
const noteAdapter = createEntityAdapter()

const initialState = noteAdapter.getInitialState()

export const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    noteTitleUpdated(state, action) {
      const { id, title } = action.payload
      noteAdapter.updateOne(state, {id, changes: { title }})
    },
    noteBodyUpdated(state, action) {
      const { id, body } = action.payload
      noteAdapter.updateOne(state, {id, changes: { body }})
    },
    allNoteSet(state, action) {
      noteAdapter.setAll(state, action.payload)
    }
  }
})

export default noteSlice.reducer

export const { noteTitleUpdated, noteBodyUpdated, allNoteSet } = noteSlice.actions

export const { selectAll: selectAllNote, selectById: selectNoteById } = noteAdapter.getSelectors((state) => state.notes)
