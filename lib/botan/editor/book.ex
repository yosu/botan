defmodule Botan.Editor.Book do
  @moduledoc false
  use Botan.Schema, prefix: "book:"
  import Ecto.Changeset

  schema "books" do
    field :name, :string

    belongs_to(:parent_book, Botan.Editor.Book)
    has_many(:books, Botan.Editor.Book)

    timestamps(type: :utc_datetime_usec)
  end

  @doc false
  def changeset(book, attrs) do
    book
    |> cast(attrs, [:name, :parent_book_id])
    |> validate_required([:id, :name])
  end

  def import_changeset(attrs) do
    %__MODULE__{}
    |> cast(attrs, [:id, :name, :parent_book_id, :inserted_at, :updated_at])
    |> validate_required([:id, :name, :inserted_at, :updated_at])
  end
end
