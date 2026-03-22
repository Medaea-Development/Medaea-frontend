import { createContext } from "react";
import type { FavoriteItem } from "./FavoritesContext";

interface FavoritesContextType {
  favorites: FavoriteItem[];
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (path: string) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);
