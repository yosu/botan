defmodule Botan.EditorFixtures do
  @moduledoc false
  alias Botan.Editor

  def valid_note_attributes(attrs \\ %{}) do
    Enum.into(attrs, %{
      title: "some title",
      body: "some body",
      book_id: book_fixture().id
    })
  end

  def note_fixture(attrs \\ %{}) do
    {:ok, note} =
      attrs
      |> valid_note_attributes()
      |> Editor.create_note()

    note
  end

  def valid_book_attributes(attrs \\ %{}) do
    Enum.into(attrs, %{
      name: "some name"
    })
  end

  def book_fixture(attrs \\ %{}) do
    {:ok, book} =
      attrs
      |> valid_book_attributes()
      |> Editor.create_book()

    book
  end
end
