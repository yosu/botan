defmodule Botan.Repo do
  use Ecto.Repo,
    otp_app: :botan,
    adapter: Ecto.Adapters.Postgres
end
