import { useContext } from "react";
import { Card } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { GlobalContext } from "src/root";
import { PlaylistType } from "src/types/types";

type Props = {
  playlist: PlaylistType;
};

export const PlayList = ({ playlist }: Props): JSX.Element => {
  const { isLightTheme } = useContext(GlobalContext);
  const [, setSearchParams] = useSearchParams();

  return (
    <Card
      className={`playlist p-1 m-3 ${isLightTheme ? "light" : "dark"}`}
      onClick={() => setSearchParams({ "playlist-id": playlist.id })}
    >
      <Card.Img
        src={
          playlist.images
            ? playlist.images[0].url
            : "https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg"
        }
        className="playlist-icon"
      />
      <span className="fs-5 m-1">{playlist.name}</span>
    </Card>
  );
};
