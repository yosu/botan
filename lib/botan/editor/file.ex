defmodule Botan.Editor.File do
  use Botan.Schema, prefix: "file:"
  import Ecto.Changeset

  schema "file" do
    field :data, :binary
    field :name, :string
    field :digest, :string
    field :content_type, :string
    field :content_length, :integer

    belongs_to(:user, Botan.Account.User)

    timestamps(type: :utc_datetime_usec, updated_at: false)
  end

  @doc false
  def changeset(file, attrs, scope) do
    file
    |> cast(attrs, [:id, :name, :digest, :content_type, :content_length, :data])
    |> validate_required([:id, :name, :digest, :content_type, :content_length, :data])
    |> put_change(:user_id, scope.user.id)
  end

  def new_changeset(attrs, scope) do
    %__MODULE__{}
    |> cast(attrs, [:name, :digest, :content_type, :content_length, :data])
    |> validate_required([:name, :digest, :content_type, :content_length, :data])
    |> put_change(:user_id, scope.user.id)
  end

  def import_changeset(attrs) do
    %__MODULE__{}
    |> cast(attrs, [:id, :name, :digest, :content_type, :content_length, :data, :inserted_at])
    |> validate_required([
      :id,
      :name,
      :digest,
      :content_type,
      :content_length,
      :data,
      :inserted_at
    ])
  end
end
