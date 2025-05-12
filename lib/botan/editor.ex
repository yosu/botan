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

  defp digest(data) do
    :crypto.hash(:md5, data)
    |> Base.encode64()
    |> then(&("md5-" <> &1))
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
          "data" => data64
        }
      },
      "createdAt" => created_at

    } ->
      data = Base.decode64!(data64)

      {compact_data, compact_name, content_type} = Botan.Image.compact!(name, data)

      %{
        id: id,
        name: compact_name,
        digest: digest(compact_data),
        inserted_at: DateTime.from_unix!(created_at, :millisecond),
        data: compact_data,
        content_length: byte_size(data),
        content_type: content_type
      }
     end)
     |> Botan.Editor.File.import_changeset()
     |> Repo.insert!()
  end

  def import_all_files(path) do
    path
    |> Path.expand()
    |> then(fn p -> [p, "*.json"] end)
    |> Path.join()
    |> Path.wildcard()
    |> then(fn files ->
      for file <- files do
        import_file(file)
      end
    end)
  end

  def get_file(id) do
    Repo.get(Botan.Editor.File, id)
  end

  def save_file(name, path) do
    {:ok, data} = File.read(path)

    {compact_data, compact_name, content_type} = Botan.Image.compact!(name, data)

    Botan.Editor.File.new_changeset(%{
      name: compact_name,
      data: compact_data,
      content_type: content_type,
      content_length: byte_size(compact_data),
      digest: digest(compact_data)
    })
    |> Repo.insert!()
  end

  def replace_urls() do
    for note <- Repo.all(Botan.Editor.Note) do
      body = Regex.replace(~r"inkdrop://", note.body, "/file/")
      Botan.Editor.Note.changeset(note, %{body: body})
      |> Repo.update()
    end
  end

  alias Botan.Editor.Book

  @doc """
  Returns the list of books.

  ## Examples

      iex> list_books()
      [%Book{}, ...]

  """
  def list_books do
    Repo.all(Book)
  end

  @doc """
  Gets a single book.

  Raises `Ecto.NoResultsError` if the Book does not exist.

  ## Examples

      iex> get_book!(123)
      %Book{}

      iex> get_book!(456)
      ** (Ecto.NoResultsError)

  """
  def get_book!(id), do: Repo.get!(Book, id)

  @doc """
  Creates a book.

  ## Examples

      iex> create_book(%{field: value})
      {:ok, %Book{}}

      iex> create_book(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_book(attrs \\ %{}) do
    %Book{}
    |> Book.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a book.

  ## Examples

      iex> update_book(book, %{field: new_value})
      {:ok, %Book{}}

      iex> update_book(book, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_book(%Book{} = book, attrs) do
    book
    |> Book.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a book.

  ## Examples

      iex> delete_book(book)
      {:ok, %Book{}}

      iex> delete_book(book)
      {:error, %Ecto.Changeset{}}

  """
  def delete_book(%Book{} = book) do
    Repo.delete(book)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking book changes.

  ## Examples

      iex> change_book(book)
      %Ecto.Changeset{data: %Book{}}

  """
  def change_book(%Book{} = book, attrs \\ %{}) do
    Book.changeset(book, attrs)
  end
end
