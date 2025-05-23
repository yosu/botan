import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { createNote, deleteNote as deleteOneNote } from "../api/note";

const noteAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.updatedAt.localeCompare(a.updatedAt)
})

export const createNewNote = createAsyncThunk("notes/createNewNote", createNote)
export const deleteNote = createAsyncThunk("notes/deleteNote", deleteOneNote)

const initialState = noteAdapter.getInitialState()

export const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    noteTitleUpdated(state, action) {
      const { id, title } = action.payload
      const updatedAt = new Date().toISOString()
      noteAdapter.updateOne(state, {id, changes: { title, updatedAt }})
    },
    noteTouched(state, action) {
      const { id, } = action.payload
      const updatedAt = new Date().toISOString()
      noteAdapter.updateOne(state, {id, changes: { updatedAt }})
    },
    allNoteSet(state, action) {
      noteAdapter.setAll(state, action.payload)
    }
  },
  extraReducers: builder => {
    builder.addCase(createNewNote.fulfilled, (state, action) => noteAdapter.addOne(state, action.payload))
    builder.addCase(deleteNote.fulfilled, (state, action) => noteAdapter.removeOne(state, action.payload))
  }
})

export default noteSlice.reducer

export const { noteTitleUpdated, noteTouched, allNoteSet } = noteSlice.actions

export const { selectAll: selectAllNote, selectById: selectNoteById } = noteAdapter.getSelectors((state) => state.notes)

export const selectFirstNote = (state => {
  const [note] = selectAllNote(state)
  return note
})
