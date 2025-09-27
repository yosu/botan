defmodule BotanWeb.PageController do
  use BotanWeb, :controller

  def home(conn, _params) do
    if conn.assigns.current_user do
      redirect(conn, to: ~p"/app")
    else
      render(conn, :home, layout: false)
    end
  end
end
