defmodule Botan.EditorFixtures do
  alias Botan.Editor

  def unique_note_id, do: "note:abcdefgh#{System.unique_integer()}"

  def valid_note_attributes(attrs \\ %{}) do
    Enum.into(attrs, %{
      title: "some title",
      body: "some body"
    })
  end

  def note_fixture(attrs \\ %{}) do
    {:ok, note} = attrs
    |> valid_note_attributes()
    |> Editor.create_note()

    note
  end
end
