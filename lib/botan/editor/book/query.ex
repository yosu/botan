defmodule Botan.Editor.Book.Query do
  @moduledoc """
  The query module of the book.
  """
  alias Botan.Editor.Book
  import Ecto.Query

  def order_by_name(base \\ Book) do
    base
    |> order_by(:name)
  end
end
