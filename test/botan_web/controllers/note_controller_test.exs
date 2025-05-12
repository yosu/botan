defmodule BotanWeb.NoteControllerTest do
  use BotanWeb.ConnCase

  import Botan.EditorFixtures

  alias Botan.Editor.Note

  @create_attrs %{
    title: "some title",
    body: "some body"
  }
  @update_attrs %{
    title: "other title",
    body: "other body"
  }
  @invalid_attrs %{
    title: nil,
    body: nil
  }

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    setup [:register_and_log_in_user]

    test "lists all notes", %{conn: conn} do
      note = note_fixture()

      conn = get(conn, ~p"/api/notes")

      assert json_response(conn, 200)["data"] == [
               %{
                 "id" => note.id,
                 "bookId" => note.book_id,
                 "title" => note.title,
                 "body" => note.body,
                 "updatedAt" => JSON.encode!(note.updated_at) |> JSON.decode!()
               }
             ]
    end

    test "lists filter by book_id params", %{conn: conn} do
      note_fixture()
      book = book_fixture()
      note = note_fixture(%{book_id: book.id})

      conn = get(conn, ~p"/api/notes?book_id=#{book.id}")

      assert json_response(conn, 200)["data"] == [
               %{
                 "id" => note.id,
                 "bookId" => book.id,
                 "title" => note.title,
                 "body" => note.body,
                 "updatedAt" => JSON.encode!(note.updated_at) |> JSON.decode!()
               }
             ]
    end
  end

  describe "create note" do
    setup [:register_and_log_in_user]

    test "renders note when data is valid", %{conn: conn} do
      conn = post(conn, ~p"/api/notes", note: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, ~p"/api/notes/#{id}")

      assert %{
               "id" => ^id
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, ~p"/api/notes", note: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update note" do
    setup [:register_and_log_in_user, :create_note]

    test "renders note when data is valid", %{conn: conn, note: %Note{id: id} = note} do
      conn = put(conn, ~p"/api/notes/#{note}", note: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, ~p"/api/notes/#{id}")

      assert %{
               "id" => ^id
             } = json_response(conn, 200)["data"]
    end

    @tag :wip
    test "renders errors when data is invalid", %{conn: conn, note: note} do
      conn = put(conn, ~p"/api/notes/#{note}", note: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete note" do
    setup [:register_and_log_in_user, :create_note]

    test "deletes chosen note", %{conn: conn, note: note} do
      conn = delete(conn, ~p"/api/notes/#{note}")
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, ~p"/api/notes/#{note}")
      end
    end
  end

  defp create_note(_) do
    note = note_fixture()
    %{note: note}
  end
end
