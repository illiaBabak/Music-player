import { useContext } from 'react';
import { Card, Image } from 'react-bootstrap';
import { GlobalContext } from 'src/root';
import { TrackType } from 'src/types/types';

type Props = {
  track: TrackType;
  isLine: boolean;
};

export const Track = ({ track, isLine }: Props): JSX.Element => {
  const { setCurrentUriTrack } = useContext(GlobalContext);

  return (
    <Card className={`track p-2 m-2 d-flex flex-row align-items-center ${isLine ? 'line' : ''}`}>
      <Card.Img src={track.album.images[0].url ?? ''} className='track-img' />
      <Card.Body className='track-body d-flex flex-row justify-content-between align-items-center'>
        <span className='fs-6'>{track.name}</span>

        <Image
          className='btn-img'
          src='https://www.svgrepo.com/show/526106/play.svg'
          onClick={() => setCurrentUriTrack(track.uri)}
        />
      </Card.Body>
    </Card>
  );
};
