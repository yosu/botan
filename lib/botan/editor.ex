defmodule Botan.Editor do
  alias Botan.Repo
  alias Botan.Editor.Book
  alias Botan.Editor.Note

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

  def book_tree() do
    groups =
      Repo.all(Book.Query.order_by_name())
      |> Enum.map(&Map.take(&1, [:id, :name, :parent_book_id]))
      |> Enum.group_by(& &1.parent_book_id)

    Enum.map(groups[nil], &associate_children(&1, groups))
  end

  defp associate_children(node, groups) do
    children = Enum.map(groups[node.id] || [], &associate_children(&1, groups))

    Map.put(node, :children, children)
  end

  defp import_note(json) do
    json
    |> Note.import_changeset()
    |> Repo.insert!()
  end

  def import_all_notes(path) do
    path
    |> Path.expand()
    |> then(fn p -> [p, "*.json"] end)
    |> Path.join()
    |> Path.wildcard()
    |> Enum.map(&File.read!/1)
    |> Enum.map(&Jason.decode!/1)
    |> Enum.reject(fn %{"bookId" => book_id} -> book_id == "trash" end)
    |> Enum.map(fn %{
                     "_id" => id,
                     "title" => title,
                     "body" => body,
                     "bookId" => book_id,
                     "createdAt" => created_at,
                     "updatedAt" => updated_at
                   } ->
      %{
        id: id,
        title: title,
        body: body,
        book_id: book_id,
        inserted_at: DateTime.from_unix!(created_at, :millisecond),
        updated_at: DateTime.from_unix!(updated_at, :millisecond)
      }
    end)
    |> then(fn jsons ->
      for json <- jsons do
        import_note(json)
      end
    end)
  end
end
