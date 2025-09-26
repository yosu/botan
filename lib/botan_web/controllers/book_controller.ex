defmodule BotanWeb.BookController do
  use BotanWeb, :controller

  alias Botan.Editor
  alias Botan.Editor.Book

  action_fallback BotanWeb.FallbackController

  def index(conn, _params) do
    books = Editor.list_books(conn.assigns.current_scope)
    render(conn, :index, books: books)
  end

  def create(conn, %{"book" => book_params}) do
    with {:ok, %Book{} = book} <- Editor.create_book(conn.assigns.current_scope, book_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/books/#{book}")
      |> render(:show, book: book)
    end
  end

  def show(conn, %{"id" => id}) do
    book = Editor.get_book!(conn.assigns.current_scope, id)
    render(conn, :show, book: book)
  end

  def update(conn, %{"id" => id, "book" => book_params}) do
    book = Editor.get_book!(conn.assigns.current_scope, id)

    with {:ok, %Book{} = book} <- Editor.update_book(conn.assigns.current_scope, book, book_params) do
      render(conn, :show, book: book)
    end
  end

  def delete(conn, %{"id" => id}) do
    book = Editor.get_book!(conn.assigns.current_scope, id)

    with {:ok, %Book{}} <- Editor.delete_book(conn.assigns.current_scope, book) do
      send_resp(conn, :no_content, "")
    end
  end
end
