defmodule Botan.EditorFixtures do
  @moduledoc false
  alias Botan.Editor

  def valid_note_attributes(attrs \\ %{}, scope) do
    Enum.into(attrs, %{
      title: "some title",
      body: "some body",
      book_id: book_fixture(scope).id
    })
  end

  def note_fixture(scope, attrs \\ %{}) do
    attrs =
      attrs
      |> valid_note_attributes(scope)

    {:ok, note} = Editor.create_note(scope, attrs)
    note
  end

  def valid_book_attributes(attrs \\ %{}) do
    Enum.into(attrs, %{
      name: "some name"
    })
  end

  def book_fixture(scope, attrs \\ %{}) do
    attrs =
      attrs
      |> valid_book_attributes()

    {:ok, book} = Editor.create_book(scope, attrs)
    book
  end
end
