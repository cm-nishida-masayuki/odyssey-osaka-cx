import "./Sample.css";
import { Button } from "@mui/material";
import { useFetchPokemon } from "../api/pokemon";

function SamplePage() {
  const { pokemon, isLoading, isError } = useFetchPokemon();

  if (isLoading || pokemon === undefined) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error!</p>;
  }

  return (
    <>
      {pokemon.name}
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <Button variant="contained">Hello world</Button>
    </>
  );
}

export default SamplePage;
