import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { createNote } from "../api/note";

const noteAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.updatedAt.localeCompare(a.updatedAt)
})

export const createNewNote = createAsyncThunk("notes/createNewNote", createNote)

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
  },
  extraReducers: builder => {
    builder.addCase(createNewNote.fulfilled, (state, action) => noteAdapter.addOne(state, action.payload))
  }
})

export default noteSlice.reducer

export const { noteTitleUpdated, noteBodyUpdated, allNoteSet } = noteSlice.actions

export const { selectAll: selectAllNote, selectById: selectNoteById } = noteAdapter.getSelectors((state) => state.notes)

export const selectFirstNote = (state => {
  const [note] = selectAllNote(state)
  return note
})
