defmodule Botan.Editor.Note do
  use Ecto.Schema
  import Ecto.Changeset
  import Botan.Validation

  @primary_key {:id, :string, []}
  schema "notes" do
    field :title, :string
    field :body, :string

    belongs_to :book, Botan.Editor.Book, type: :string

    timestamps(type: :utc_datetime_usec)
  end

  @doc false
  def changeset(note, attrs) do
    note
    |> cast(attrs, [:title, :body])
    |> validate_not_nil([:title, :body])
  end

  def import_changeset(attrs) do
    %__MODULE__{}
    |> cast(attrs, [:id, :title, :body, :book_id, :inserted_at, :updated_at], empty_values: [nil])
    |> validate_not_nil([:id, :title, :body, :inserted_at, :updated_at])
  end
end
