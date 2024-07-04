import { useContext } from "react";
import { Button, Card, Image } from "react-bootstrap";
import { GlobalContext } from "src/root";
import { TrackType } from "src/types/types";

type Props = {
  track: TrackType;
};

export const Track = ({ track }: Props): JSX.Element => {
  const { setCurrentTrack } = useContext(GlobalContext);

  return (
    <Card className="track p-2 m-2">
      <Card.Img src={track.album.images[0].url} className="track-img" />
      <Card.Body className="track-body">
        <span className="fs-6">{track.name}</span>
        <Button
          className="m-2 btn d-flex justify-content-center"
          variant="dark"
          disabled={!track.uri}
          onClick={() => setCurrentTrack(track)}
        >
          <Image
            className="btn-img"
            src="https://static.vecteezy.com/system/resources/previews/027/508/190/non_2x/transparent-background-play-button-free-png.png"
          />
        </Button>
      </Card.Body>
    </Card>
  );
};
