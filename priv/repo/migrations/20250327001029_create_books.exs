defmodule Botan.Repo.Migrations.CreateBooks do
  use Ecto.Migration

  def change do
    create table(:books, primary_key: false) do
      add :id, :string, primary_key: true
      add :name, :string, null: false
      add :parent_book_id, :string

      timestamps(type: :utc_datetime_usec)
    end

    create index(:books, [:parent_book_id])
  end
end
