import { useFavorites } from "@/hooks/use-favorites";
import { ActionIcon } from "@mantine/core";
import { useMemo } from "react";
import { IoStar, IoStarOutline } from "react-icons/io5";

export function CommunityFavorite({ name }: { name: string }) {
  const [favorites, setFavorites] = useFavorites();

  const isFavorited = useMemo(() => favorites.includes(name), [name, favorites]);

  return isFavorited ? (
    <ActionIcon
      color="yellow"
      onClick={(e) => {
        e.preventDefault();
        setFavorites((prev) => prev.filter((sub) => sub !== name));
        umami?.track("removeFavorite", { name });
      }}
    >
      <IoStar />
    </ActionIcon>
  ) : (
    <ActionIcon
      onClick={(e) => {
        e.preventDefault();
        setFavorites((prev) => [...prev, name]);
        umami?.track("addFavorite", { name });
      }}
    >
      <IoStarOutline />
    </ActionIcon>
  );
}
