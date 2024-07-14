import { useSearchParams } from "react-router-dom";
import { useSearchArtistQuery } from "src/api/artists";
import { Artist } from "../Artist";
import { useContext } from "react";
import { GlobalContext } from "src/root";

export const ArtistsList = (): JSX.Element => {
  const { isLightTheme, selectedChip } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();
  const searchedText = searchParams.get("query") ?? "";

  const { data: artists } = useSearchArtistQuery(searchedText);

  return (
    <div
      className={`artist-list ${isLightTheme ? "light" : "dark"} ${selectedChip === "All" ? "line" : ""}`}
    >
      {artists?.map((artist, index) => (
        <Artist artist={artist} key={`${artist.name}-${index}-artist`} />
      ))}
    </div>
  );
};
