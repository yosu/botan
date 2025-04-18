defmodule Botan.Repo.Migrations.CreateFile do
  use Ecto.Migration

  def change do
    create table(:file, primary_key: false) do
      add :id, :string, primary_key: true, null: false
      add :name, :string, null: false
      add :digest, :string, null: false
      add :content_type, :string, null: false
      add :content_length, :integer, null: false
      add :data, :binary, null: false

      timestamps(type: :utc_datetime_usec, updated_at: false)
    end
  end
end
