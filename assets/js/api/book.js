export const createBook = async (name, parentBookId = null) => {
  const fd = new FormData();

  fd.append("book[name]", name)
  fd.append("book[parent_book_id]", parentBookId)

  const resp = await fetch("/api/books", {
    method: "POST",
    body: fd
  })

  const json = await resp.json()
  return json.data
}

export const deleteBook = async (bookId) => {
  const resp = await fetch(`/api/books/${bookId}`, { method: "DELETE" })

  if (!resp.ok) {
    throw new Error(`レスポンスステータス: ${resp.status}`)
  }

  return bookId
}
