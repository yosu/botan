import { debounce } from "../util/debounce";

export const updateTitle = debounce((id, title) => {
    const fd = new FormData();
    fd.append("note[title]", title)

    fetch(`/api/notes/${id}`, {
      "method": "PATCH",
      "body": fd
    })

}, 1000)

export const updateBody = debounce((id, body) => {
    const fd = new FormData();
    fd.append("note[body]", body)

    fetch(`/api/notes/${id}`, {
      "method": "PATCH",
      "body": fd
    })

}, 1000)

export const createNote = async (bookId) => {
  const fd = new FormData();
  fd.append("note[book_id]", bookId)
  fd.append("note[title]", "Untitled")
  fd.append("note[body]", "")

  const resp = await fetch(`/api/notes`, {
    method: "POST",
    body: fd
  })

  const json = await resp.json()
  return json.data
}
