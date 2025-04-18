defmodule Botan.Editor do
  @moduledoc """
  The editor context.
  """
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
    |> Enum.sort_by(& &1.name)
  end

  defp associate_children(node, groups) do
    children =
      Enum.map(groups[node.id] || [], &associate_children(&1, groups))
      |> Enum.sort_by(& &1.name)

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

  def list_notes() do
    Repo.all(Note)
  end

  def list_notes_by_book(book_id) do
    Repo.all(Note.Query.by_book(book_id))
  end

  def get_note!(id) do
    Repo.get!(Note, id)
  end

  @doc """
  Creates a note.

  ## Examples

      iex> create_note(%{field: value})
      {:ok, %Journal{}}

      iex> create_note(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_note(attrs \\ %{}) do
    %Note{}
    |> Note.create_changeset(attrs)
    |> Repo.insert()
  end

  def update_note(%Note{} = note, attrs \\ %{}) do
    note
    |> Note.changeset(attrs)
    |> Repo.update()
  end

  def delete_note(%Note{} = note) do
    Repo.delete(note)
  end

  def create_book(attrs \\ %{}) do
    %Book{}
    |> Book.changeset(attrs)
    |> Repo.insert()
  end

  def import_file(path) do
    Path.expand(path)
    |> File.read!()
    |> Jason.decode!()
    |> then(fn %{
      "_id" => id,
      "name" => name,
      "_attachments" => %{
        "index" => %{
          "digest" => digest,
          "data" => data64
        }
      },
      "contentType" => content_type,
      "createdAt" => created_at

    } ->
      data = Base.decode64!(data64)
      %{
        id: id,
        name: name,
        digest: digest,
        inserted_at: DateTime.from_unix!(created_at, :millisecond),
        data: data,
        content_length: byte_size(data),
        content_type: content_type
      }
     end)
     |> Botan.Editor.File.import_changeset()
     |> Repo.insert!()
  end

  def get_file(id) do
    Repo.get(Botan.Editor.File, id)
  end
end
