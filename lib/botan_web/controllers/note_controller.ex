defmodule BotanWeb.NoteController do
  use BotanWeb, :controller

  alias Botan.Editor
  alias Botan.Editor.Note

  action_fallback BotanWeb.FallbackController

  def index(conn, %{"book_id" => book_id} = _params) when is_binary(book_id) do
    notes = Editor.list_notes_by_book(book_id)

    render(conn, :index, notes: notes)
  end

  def index(conn, _params) do
    notes = Editor.list_notes()
    render(conn, :index, notes: notes)
  end

  def create(conn, %{"note" => note_params}) do
    with {:ok, %Note{} = note} <- Editor.create_note(note_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/notes/#{note}")
      |> render(:show, note: note)
    end
  end

  def show(conn, %{"id" => id}) do
    note = Editor.get_note!(id)
    render(conn, :show, note: note)
  end

  def update(conn, %{"id" => id, "note" => note_params}) do
    note = Editor.get_note!(id)

    with {:ok, %Note{} = note} <- Editor.update_note(note, note_params) do
      render(conn, :show, note: note)
    end
  end

  def delete(conn, %{"id" => id}) do
    note = Editor.get_note!(id)

    with {:ok, %Note{}} <- Editor.delete_note(note) do
      send_resp(conn, :no_content, "")
    end
  end
end
