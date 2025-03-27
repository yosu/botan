defmodule Botan.Editor.Book do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :string, []}
  schema "books" do
    field :name, :string
    field :parent_book_id, :string

    has_one(:parent_book, Botan.Editor.Book)
    has_many(:books, Botan.Editor.Book)

    timestamps(type: :utc_datetime_usec)
  end

  @doc false
  def changeset(book, attrs) do
    book
    |> cast(attrs, [:id, :name, :parent_book_id])
    |> validate_required([:id, :name])
  end

  def import_changeset(attrs) do
    %__MODULE__{}
    |> cast(attrs, [:id, :name, :parent_book_id, :inserted_at, :updated_at])
    |> validate_required([:id, :name, :inserted_at, :updated_at])
  end
end
