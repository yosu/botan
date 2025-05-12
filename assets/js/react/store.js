import { configureStore } from "@reduxjs/toolkit"
import noteReducer from "./noteSlice"
import bookReducer from "./bookSlice"

export default configureStore({
  reducer: {
    notes: noteReducer,
    books: bookReducer
  }
})
