import { Button, Card } from "react-bootstrap";
import { TrackType } from "src/types/types";

type Props = {
  track: TrackType;
  setCurrentTrack: React.Dispatch<React.SetStateAction<TrackType | null>>;
};

export const Track = ({ track, setCurrentTrack }: Props): JSX.Element => {
  return (
    <Card className="track p-2 m-2">
      <Card.Img src={track.album.images[0].url} className="track-img" />
      <Card.Body className="track-body">
        <span className="fs-4">{track.name}</span>
        <Button
          className="m-2"
          variant="dark"
          disabled={!track.uri}
          onClick={() => setCurrentTrack(track)}
        >
          Play
        </Button>
      </Card.Body>
    </Card>
  );
};
