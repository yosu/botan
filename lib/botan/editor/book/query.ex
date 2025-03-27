defmodule Botan.Editor.Book.Query do
  alias Botan.Editor.Book
  import Ecto.Query

  def order_by_name(base \\ Book) do
    base
    |> order_by(:name)
  end
end
