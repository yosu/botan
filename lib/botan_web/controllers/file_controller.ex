defmodule BotanWeb.FileController do
  use BotanWeb, :controller

  alias Botan.Editor

  def show(conn, %{"id" => id}) do
    case Editor.get_file(id) do
      nil ->
        send_resp(conn, 404, "")

      file ->
        if file.digest in get_req_header(conn, "if-none-match") do
          send_resp(conn, 304, "")
        else
          conn
          |> put_resp_content_type(file.content_type)
          |> put_resp_header("cache-control", "private")
          |> put_resp_header("etag", file.digest)
          |> send_resp(200, file.data)
        end
    end
  end

  def create(conn, %{"uploadfile" => upload}) do
    IO.inspect(upload)

    file = Editor.save_file(upload.filename, upload.path)

    conn
    |> put_resp_header("content-type", "application/json")
    |> send_resp(201, JSON.encode!(%{data: %{url: ~p"/file/#{file.id}"}}))
  end
end
