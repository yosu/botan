import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const bookAdapter = createEntityAdapter()

const initialState = bookAdapter.getInitialState()

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    allBookSet: (state, action) => {
      bookAdapter.setAll(state, action.payload)
    }
  }
})

export default bookSlice.reducer

export const { allBookSet } = bookSlice.actions

export const { selectAll: SelectAllBooks, selectById: selectBookById } = bookAdapter.getSelectors((state) => state.books)
