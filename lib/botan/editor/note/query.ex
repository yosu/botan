defmodule Botan.Editor.Note.Query do
  @moduledoc """
  The query module of the note.
  """
  import Ecto.Query
  alias Botan.Editor.Note

  def by_book(base \\ Note, book_id) do
    where(base, [n], n.book_id == ^book_id)
  end
end
