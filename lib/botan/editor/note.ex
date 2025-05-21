defmodule Botan.Editor.Note do
  @moduledoc false
  use Botan.Schema, prefix: "note:"
  import Ecto.Changeset
  import Botan.Validation

  schema "notes" do
    field :title, :string
    field :body, :string

    belongs_to :book, Botan.Editor.Book

    timestamps(type: :utc_datetime_usec)
  end

  @doc false
  def changeset(note, attrs) do
    note
    |> cast(attrs, [:title, :body, :book_id], empty_values: [nil])
    |> validate_not_nil([:title, :body])
  end

  @doc false
  def create_changeset(note, attrs) do
    note
    |> cast(attrs, [:title, :body, :book_id], empty_values: [nil])
    |> validate_not_nil([:title, :body, :book_id])
  end

  def import_changeset(attrs) do
    %__MODULE__{}
    |> cast(attrs, [:id, :title, :body, :book_id, :inserted_at, :updated_at], empty_values: [nil])
    |> validate_not_nil([:id, :title, :body, :inserted_at, :updated_at])
  end

  def replace_changeset(note, attrs) do
    note
    |> cast(attrs, [:body, :updated_at], empty_values: [nil], force_changes: true)
    |> validate_not_nil([:body, :updated_at])
  end
end
