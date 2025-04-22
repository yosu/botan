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
