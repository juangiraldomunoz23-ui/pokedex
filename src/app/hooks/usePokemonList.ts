import { useEffect, useState } from "react";
import {
  PokemonListItem,
  PokemonListResponse,
} from "../types/pokemon";

export const usePokemonList = () => {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"
        );

        if (!response.ok) {
          throw new Error(
            "Error al obtener los Pokémon"
          );
        }

        const data: PokemonListResponse =
          await response.json();

        setPokemon(data.results);
      } catch (err) {
        setPokemon([]);
        setError(
          "No se pudieron cargar los Pokémon"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  return {
    pokemon,
    loading,
    error,
  };
};