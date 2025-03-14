defmodule BotanWeb.AppController do
  use BotanWeb, :controller

  def app(conn, _params) do
    render(conn, :app)
  end
end
