defmodule Botan.Editor.File do
  use Botan.Schema, prefix: "file"
  import Ecto.Changeset

  schema "file" do
    field :data, :binary
    field :name, :string
    field :digest, :string
    field :content_type, :string
    field :content_length, :integer

    timestamps(type: :utc_datetime_usec, updated_at: false)
  end

  @doc false
  def changeset(file, attrs) do
    file
    |> cast(attrs, [:id, :name, :digest, :content_type, :content_length, :data])
    |> validate_required([:id, :name, :digest, :content_type, :content_length, :data])
  end

  def import_changeset(attrs) do
    %__MODULE__{}
    |> cast(attrs, [:id, :name, :digest, :content_type, :content_length, :data, :inserted_at])
    |> validate_required([:id, :name, :digest, :content_type, :content_length, :data, :inserted_at])
  end
end
