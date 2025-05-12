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

    import Botan.EditorFixtures

    @invalid_attrs %{name: nil}

    test "list_books/0 returns all books" do
      book = book_fixture()
      assert Editor.list_books() == [book]
    end

    test "get_book!/1 returns the book with given id" do
      book = book_fixture()
      assert Editor.get_book!(book.id) == book
    end

    test "create_book/1 with valid data creates a book" do
      valid_attrs = %{name: "some name"}

      assert {:ok, %Book{} = book} = Editor.create_book(valid_attrs)
      assert book.name == "some name"
    end

    test "create_book/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Editor.create_book(@invalid_attrs)
    end

    test "update_book/2 with valid data updates the book" do
      book = book_fixture()
      update_attrs = %{name: "some updated name"}

      assert {:ok, %Book{} = book} = Editor.update_book(book, update_attrs)
      assert book.name == "some updated name"
    end

    test "update_book/2 with invalid data returns error changeset" do
      book = book_fixture()
      assert {:error, %Ecto.Changeset{}} = Editor.update_book(book, @invalid_attrs)
      assert book == Editor.get_book!(book.id)
    end

    test "delete_book/1 deletes the book" do
      book = book_fixture()
      assert {:ok, %Book{}} = Editor.delete_book(book)
      assert_raise Ecto.NoResultsError, fn -> Editor.get_book!(book.id) end
    end

    test "change_book/1 returns a book changeset" do
      book = book_fixture()
      assert %Ecto.Changeset{} = Editor.change_book(book)
    end
  end
end
