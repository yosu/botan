defmodule Botan.Validation do
  @moduledoc """
  Additional Ecto validation
  """
  import Ecto.Changeset

  def validate_not_nil(changeset, fields) do
    Enum.reduce(fields, changeset, fn field, changeset ->
      case get_field(changeset, field) do
        nil -> add_error(changeset, field, "can't be nil")
        _ -> changeset
      end
    end)
  end
end
