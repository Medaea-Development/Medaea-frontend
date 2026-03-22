import { useState, useEffect, type ReactNode } from "react";
import { FavoritesContext } from "./FavoritesContext.types";

export interface FavoriteItem {
  id: string;
  label: string;
  path: string;
}

const STORAGE_KEY = "medaea_favorites";

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from localStorage
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (item: FavoriteItem) => {
    setFavorites((prev) =>
      prev.find((f) => f.path === item.path)
        ? prev.filter((f) => f.path !== item.path)
        : [...prev, item],
    );
  };

  const isFavorite = (path: string) => favorites.some((f) => f.path === path);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
