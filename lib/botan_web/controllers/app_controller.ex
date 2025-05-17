defmodule BotanWeb.AppController do
  use BotanWeb, :controller

  alias Botan.Editor

  def app(conn, _params) do
    books = Editor.list_books() |> Enum.map(&Map.take(&1, [:id, :name, :parent_book_id]))
    render(conn, :app, props: Jason.encode!(%{books: books}))
  end
end
