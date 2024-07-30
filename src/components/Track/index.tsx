import { useContext } from 'react';
import { Card, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from 'src/root';
import { TrackType } from 'src/types/types';
import { msToMinSec } from 'src/utils/msToSeconds';

type Props = {
  track: TrackType;
  isLine: boolean;
};

export const Track = ({ track, isLine }: Props): JSX.Element => {
  const { setCurrentUriTrack } = useContext(GlobalContext);
  const navigate = useNavigate();

  return (
    <Card className={`track p-2 m-2 d-flex flex-row align-items-center ${isLine ? 'line' : ''}`}>
      <Image
        className='btn-img ms-2'
        src='https://www.svgrepo.com/show/526106/play.svg'
        onClick={() => setCurrentUriTrack(track.uri)}
      />

      <Card.Img src={track.album.images.length ? track.album.images[0].url : ''} className='track-img ms-4' />
      <Card.Body className='track-info d-flex flex-row justify-content-end align-items-center text-white'>
        <span className='fs-6 track-name'>{track.name}</span>

        {!isLine && (
          <>
            <span className='fs-6 track-duration'>{msToMinSec(track.duration_ms)}</span>
            <span className='fs-6 d-flex flex-row justify-content-start align-items-center artists-track'>
              {track.artists.map((artist) => (
                <p className='artist-track m-0 ms-2' onClick={() => navigate(`/artist?artist-id=${artist.id}`)}>
                  {artist.name}
                </p>
              ))}
            </span>
          </>
        )}
      </Card.Body>
    </Card>
  );
};
