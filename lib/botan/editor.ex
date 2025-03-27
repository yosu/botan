defmodule Botan.Editor do
  alias Botan.Repo
  alias Botan.Editor.Book

  def import_book(path) do
    path
    |> Path.expand()
    |> File.read!()
    |> Jason.decode!()
    |> then(fn %{
                 "_id" => id,
                 "name" => name,
                 "parentBookId" => parent_book_id,
                 "createdAt" => created_at,
                 "updatedAt" => updated_at
               } ->
      %{
        id: id,
        name: name,
        parent_book_id: parent_book_id,
        inserted_at: DateTime.from_unix!(created_at, :millisecond),
        updated_at: DateTime.from_unix!(updated_at, :millisecond)
      }
    end)
    |> Book.import_changeset()
    |> Repo.insert!()
  end

  def import_all_books(path) do
    path
    |> Path.expand()
    |> then(fn p -> [p, "*.json"] end)
    |> Path.join()
    |> Path.wildcard()
    |> then(fn files ->
      for file <- files do
        import_book(file)
      end
    end)
  end
end
