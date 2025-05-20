defmodule Botan.Image do
  def compact!(name, data) do
    new_data =
      Image.from_binary!(data)
      |> Image.thumbnail!(1200, resize: :down)
      |> Image.write!(:memory, suffix: ".webp")

    new_name = Path.rootname(name) <> ".webp"
    {new_data, new_name, "image/webp"}
  end
end
