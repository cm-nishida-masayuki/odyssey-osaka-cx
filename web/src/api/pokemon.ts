import useSWR from "swr";

const fetcher = (key: string) => fetch(key).then((res) => res.json());

export const useFetchPokemon = () => {
  const { data, error, isLoading } = useSWR<{
    name: string;
    sprites: {
      front_default: string;
    };
  }>("https://pokeapi.co/api/v2/pokemon/ditto", fetcher);

  return {
    pokemon: data,
    isLoading,
    isError: error,
  } as const;
};
