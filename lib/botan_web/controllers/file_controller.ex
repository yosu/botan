defmodule BotanWeb.FileController do
  use BotanWeb, :controller

  alias Botan.Editor

  def show(conn, %{"id" => id}) do
    case Editor.get_file(id) do
      nil ->
        send_resp(conn, 404, "")
      file ->
        conn
        |> put_resp_header("content-type", file.content_type)
        |> send_resp(200, file.data)
    end
  end

  def create(conn, %{"uploadfile" => upload}) do
    IO.inspect(upload)

    file = Editor.save_file(upload.filename, upload.path)

    conn
    |> put_resp_header("content-type", "application/json")
    |> send_resp(201, JSON.encode!(%{data: %{ url: ~p"/file/#{file.id}"}}))
  end
end
