defmodule Botan.Repo.Migrations.AddUserColumnToEditorData do
  use Ecto.Migration

  def change do
    alter table(:books) do
      add :user_id, references(:users, on_delete: :restrict)
    end

    alter table(:notes) do
      add :user_id, references(:users, on_delete: :restrict)
    end

    alter table(:file) do
      add :user_id, references(:users, on_delete: :restrict)
    end
  end
end
