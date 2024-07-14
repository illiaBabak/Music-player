import { useContext } from "react";
import { Card, Image } from "react-bootstrap";
import { GlobalContext } from "src/root";
import { TrackType } from "src/types/types";

type Props = {
  track: TrackType;
};

export const Track = ({ track }: Props): JSX.Element => {
  const { setCurrentTrack, isLightTheme, selectedChip } =
    useContext(GlobalContext);

  return (
    <Card
      className={`track p-2 m-2 ${isLightTheme ? "light" : "dark"}  ${selectedChip === "All" ? "line" : ""}`}
    >
      <Card.Img src={track.album.images[0].url} className="track-img" />
      <Card.Body className="track-body">
        <span className="fs-6">{track.name}</span>

        <Image
          className="btn-img"
          src={
            isLightTheme
              ? "https://static.vecteezy.com/system/resources/previews/027/508/190/non_2x/transparent-background-play-button-free-png.png"
              : "https://www.svgrepo.com/show/526106/play.svg"
          }
          onClick={() => setCurrentTrack(track)}
        />
      </Card.Body>
    </Card>
  );
};
