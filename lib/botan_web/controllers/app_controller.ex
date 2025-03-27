defmodule BotanWeb.AppController do
  use BotanWeb, :controller

  alias Botan.Editor

  def app(conn, _params) do
    book_tree = Editor.book_tree()
    render(conn, :app, props: Jason.encode!(%{books: book_tree}))
  end
end
