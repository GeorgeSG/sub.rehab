import { useLocalStorage } from "@mantine/hooks";

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>({
    key: "sub-rehab-favorite-subreddits",
    defaultValue: [],
  });

  return [favorites, setFavorites] as const;
}
