import { useEffect } from "react"

export const NoteList = ({ bookId }) => {

  useEffect(() => {
    // fetch("/api/notes").then(resp => {
    //   console.log(resp)
    // })
    console.log("bookId", bookId)
  }, [bookId])
}
