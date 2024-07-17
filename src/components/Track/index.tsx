import { useContext } from 'react';
import { Card, Image } from 'react-bootstrap';
import { GlobalContext } from 'src/root';
import { TrackType } from 'src/types/types';

type Props = {
  track: TrackType;
  isLine: boolean;
};

export const Track = ({ track, isLine }: Props): JSX.Element => {
  const { setCurrentTrack } = useContext(GlobalContext);

  return (
    <Card className={`track p-2 m-2  ${isLine ? 'line' : ''}`}>
      <Card.Img src={track.album.images[0].url} className='track-img' />
      <Card.Body className='track-body'>
        <span className='fs-6'>{track.name}</span>

        <Image
          className='btn-img'
          src={'https://www.svgrepo.com/show/526106/play.svg'}
          onClick={() => setCurrentTrack(track)}
        />
      </Card.Body>
    </Card>
  );
};
