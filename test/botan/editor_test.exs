defmodule Botan.EditorTest do
  alias Botan.EditorFixtures
  use Botan.DataCase

  alias Botan.Editor

  describe "notes" do
    alias Botan.Editor.Note

    import EditorFixtures
    import Botan.AccountFixtures, only: [user_scope_fixture: 0]

    @invalid_attrs %{title: nil, body: nil}

    test "list_notes/1 returns all notes" do
      scope = user_scope_fixture()
      note = note_fixture(scope)
      assert Editor.list_notes(scope) == [note]
    end

    test "list_notes_by_book/1 returns the notes in the book" do
      scope = user_scope_fixture()
      book = book_fixture(scope)
      note = note_fixture(scope, %{book_id: book.id})
      note_fixture(scope)

      assert Editor.list_notes_by_book(scope, book.id) == [note]
    end

    test "create_note/2 with valid data creates a note" do
      scope = user_scope_fixture()
      book = book_fixture(scope)

      valid_attrs = %{title: "some title", body: "some body", book_id: book.id}

      assert {:ok, %Note{} = note} = Editor.create_note(scope, valid_attrs)
      assert note.title == "some title"
      assert note.body == "some body"
      assert note.user_id == scope.user.id
    end

    test "create_note/2 with invalid data returns error changeset" do
      scope = user_scope_fixture()
      assert {:error, %Ecto.Changeset{}} = Editor.create_note(scope, @invalid_attrs)
    end

    test "update_note/3 with valid data updates the post" do
      scope = user_scope_fixture()
      note = note_fixture(scope)
      update_attrs = %{title: "some updated title", body: "some updated body"}

      assert {:ok, %Note{} = note} = Editor.update_note(scope, note, update_attrs)
      assert note.title == "some updated title"
      assert note.body == "some updated body"
    end

    test "update_note/3 with invalid scope raises" do
      scope = user_scope_fixture()
      other_scope = user_scope_fixture()
      note = note_fixture(scope)

      assert_raise MatchError, fn ->
        Editor.update_note(other_scope, note, %{})
      end
    end

    test "update_note/3 with invalid data returns error changeset" do
      scope = user_scope_fixture()
      note = note_fixture(scope)
      assert {:error, %Ecto.Changeset{}} = Editor.update_note(scope, note, @invalid_attrs)
      assert note == Editor.get_note!(scope, note.id)
    end

    test "delete_note/2 deletes the note" do
      scope = user_scope_fixture()
      note = note_fixture(scope)
      assert {:ok, %Note{}} = Editor.delete_note(scope, note)
      assert_raise Ecto.NoResultsError, fn -> Editor.get_note!(scope, note.id) end
    end

    test "delete_note/2 with invalid scope raises" do
      scope = user_scope_fixture()
      other_scope = user_scope_fixture()
      note = note_fixture(scope)
      assert_raise MatchError, fn -> Editor.delete_note(other_scope, note) end
    end
  end

  describe "books" do
    alias Botan.Editor.Book

    import Botan.EditorFixtures
    import Botan.AccountFixtures, only: [user_scope_fixture: 0]

    @invalid_attrs %{name: nil}

    test "list_books/1 returns all books" do
      scope = user_scope_fixture()
      book = book_fixture(scope)
      assert Editor.list_books(scope) == [book]
    end

    test "get_book!/1 returns the book with given id" do
      scope = user_scope_fixture()
      book = book_fixture(scope)
      assert Editor.get_book!(scope, book.id) == book
    end

    test "create_book/1 with valid data creates a book" do
      valid_attrs = %{name: "some name"}
      scope = user_scope_fixture()

      assert {:ok, %Book{} = book} = Editor.create_book(scope, valid_attrs)
      assert book.name == "some name"
    end

    test "create_book/1 with invalid data returns error changeset" do
      scope = user_scope_fixture()
      assert {:error, %Ecto.Changeset{}} = Editor.create_book(scope, @invalid_attrs)
    end

    test "update_book/2 with valid data updates the book" do
      scope = user_scope_fixture()
      book = book_fixture(scope)
      update_attrs = %{name: "some updated name"}

      assert {:ok, %Book{} = book} = Editor.update_book(scope, book, update_attrs)
      assert book.name == "some updated name"
    end

    test "update_book/2 with invalid data returns error changeset" do
      scope = user_scope_fixture()
      book = book_fixture(scope)
      assert {:error, %Ecto.Changeset{}} = Editor.update_book(scope, book, @invalid_attrs)
      assert book == Editor.get_book!(scope, book.id)
    end

    test "delete_book/1 deletes the book" do
      scope = user_scope_fixture()
      book = book_fixture(scope)
      assert {:ok, %Book{}} = Editor.delete_book(scope, book)
      assert_raise Ecto.NoResultsError, fn -> Editor.get_book!(scope, book.id) end
    end

    test "change_book/1 returns a book changeset" do
      scope = user_scope_fixture()
      book = book_fixture(scope)
      assert %Ecto.Changeset{} = Editor.change_book(book, scope)
    end
  end
end
