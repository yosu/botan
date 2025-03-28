defmodule Botan.EditorFixtures do
  @moduledoc false
  alias Botan.Editor

  def valid_note_attributes(attrs \\ %{}) do
    Enum.into(attrs, %{
      title: "some title",
      body: "some body"
    })
  end

  def note_fixture(attrs \\ %{}) do
    {:ok, note} =
      attrs
      |> valid_note_attributes()
      |> Editor.create_note()

    note
  end
end
