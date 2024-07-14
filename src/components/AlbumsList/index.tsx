import { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchAlbumsQuery } from "src/api/albums";
import { GlobalContext } from "src/root";
import { Album } from "../Album";

export const AlbumsList = (): JSX.Element => {
  const { isLightTheme, selectedChip } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();
  const searchedText = searchParams.get("query") ?? "";

  const { data: albums } = useSearchAlbumsQuery(searchedText);

  return (
    <div
      className={`albums-list ${isLightTheme ? "light" : "dark"} ${selectedChip === "All" ? "line" : ""}`}
    >
      {albums?.map((album, index) => (
        <Album
          album={album}
          key={`${album.name}-${album.release_date}-${index}-album`}
        />
      ))}
    </div>
  );
};
