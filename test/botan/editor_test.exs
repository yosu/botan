defmodule Botan.EditorTest do
  alias Botan.EditorFixtures
  use Botan.DataCase

  alias Botan.Editor

  describe "notes" do
    import EditorFixtures

    test "list_notes/0 returns all notes" do
      note = note_fixture()
      assert Editor.list_notes() == [note]
    end

    test "list_notes_by_book/1 returns the notes in the book" do
      book = book_fixture()
      note = note_fixture(%{book_id: book.id})
      note_fixture()

      assert Editor.list_notes_by_book(book.id) == [note]
    end
  end

  describe "books" do
    alias Botan.Editor.Book

    test "create_book/0 creates a book" do
      valid_attrs = %{name: "some name"}

      assert {:ok, %Book{} = book} = Editor.create_book(valid_attrs)
      assert book.name == valid_attrs.name
    end
  end
end
