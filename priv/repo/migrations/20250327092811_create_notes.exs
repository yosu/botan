defmodule Botan.Repo.Migrations.CreateNotes do
  use Ecto.Migration

  def change do
    create table(:notes, primary_key: false) do
      add :id, :string, primary_key: true
      add :title, :string, null: false
      add :body, :text, null: false
      add :book_id, references(:books, on_delete: :restrict)

      timestamps(type: :utc_datetime_usec)
    end

    create index(:notes, [:book_id])
  end
end
