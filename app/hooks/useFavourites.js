"use client";

import { useState, useEffect } from "react";

const read = () => {
  try {
    return JSON.parse(localStorage.getItem("favouriteStops")) || [];
  } catch {
    return [];
  }
};

export default function useFavourites() {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    setFavourites([...new Set(read().map(String))]);
  }, []);

  const addFavourite = (stop) => {
    setFavourites(stop);
    localStorage.setItem("favouriteStops", JSON.stringify(stop));
  };

  const isFavourite = (stop) => {
    return favourites.includes(String(stop));
  };

  const toggleFavourite = (stop) => {
    const id = String(stop);

    const current = [...new Set(read().map(String))];
    const next = current.includes(id)
      ? current.filter((c) => c != String(id))
      : [...current, id];

    localStorage.setItem("favouriteStops", JSON.stringify(next));
    addFavourite(next);
  };

  return { favourites, isFavourite, toggleFavourite };
}
