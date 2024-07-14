import { useContext } from "react";
import { Card } from "react-bootstrap";
import { GlobalContext } from "src/root";
import { AlbumType } from "src/types/types";

type Props = {
  album: AlbumType;
};

export const Album = ({ album }: Props): JSX.Element => {
  const { isLightTheme, selectedChip } = useContext(GlobalContext);

  return (
    <Card
      className={`album p-2 m-2 ${isLightTheme ? "light" : "dark"} ${selectedChip === "All" ? "line" : ""}`}
    >
      <Card.Img src={album.images[0].url} className="album-icon" />
      <span className="m-3 title">{album.name}</span>

      {selectedChip !== "All" && (
        <Card.Body className="album-body p-0">
          <div className="m-2 artists d-flex flex-row justify-content-center">
            {album.artists.map((artist, index) => (
              <p key={index} className="m-1 artist-album">
                {artist.name}
              </p>
            ))}
          </div>

          <div>
            <p className="m-0 description">Tracks: {album.total_tracks}</p>
            <p className="m-0 description">
              Release date: {album.release_date}
            </p>
          </div>
        </Card.Body>
      )}
    </Card>
  );
};
