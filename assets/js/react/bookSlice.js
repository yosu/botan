import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { createBook, deleteBook as deleteOneBook } from "../api/book";

const bookAdapter = createEntityAdapter()

export const createNewBook = createAsyncThunk("books/createNewBook", (name) => createBook(name))
export const deleteBook = createAsyncThunk("books/deleteBook", (bookId) => deleteOneBook(bookId))

const initialState = bookAdapter.getInitialState()

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    allBookSet: (state, action) => {
      bookAdapter.setAll(state, action.payload)
    }
  },
  extraReducers: builder => {
    builder.addCase(createNewBook.fulfilled, (state, action) => bookAdapter.addOne(state, action.payload))
    builder.addCase(deleteBook.fulfilled, (state, action) => bookAdapter.removeOne(state, action.payload))
  }
})

export default bookSlice.reducer

export const { allBookSet } = bookSlice.actions

export const { selectAll: SelectAllBooks, selectById: selectBookById } = bookAdapter.getSelectors((state) => state.books)
