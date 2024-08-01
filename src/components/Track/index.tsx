import { useContext } from 'react';
import { Card, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from 'src/root';
import { TrackType } from 'src/types/types';
import { msToMinSec } from 'src/utils/msToMinSec';
import { calcDuration } from 'src/utils/calcDuration';

type Props = {
  track: TrackType;
  isLine: boolean;
};

export const Track = ({ track, isLine }: Props): JSX.Element => {
  const { setCurrentUriTrack, isLightTheme } = useContext(GlobalContext);
  const navigate = useNavigate();

  return (
    <Card className={`track p-2 m-2 d-flex flex-row align-items-center ${isLine ? 'line' : ''}`}>
      <Image
        className='btn-img ms-2'
        src={isLightTheme ? '/src/images/play-icon-light.svg' : '/src/images/play.svg'}
        onClick={() => setCurrentUriTrack(track.uri)}
      />

      <Card.Img src={track.album.images.length ? track.album.images[0].url : ''} className='track-img ms-4' />
      <Card.Body className='track-info d-flex flex-row justify-content-start align-items-center'>
        <span className='fs-6 track-name text-white' style={{ animationDuration: `${calcDuration(track.name)}s` }}>
          {track.name}
        </span>

        {!isLine && (
          <>
            <span className='fs-6 track-duration text-white'>{msToMinSec(track.duration_ms)}</span>
            <span className='fs-6 d-flex flex-row justify-content-start align-items-center artists-track text-white'>
              {track.artists.map((artist) => (
                <p
                  key={`${artist.id}-${track.id}-text`}
                  className='artist-track m-0 ms-2'
                  onClick={() => navigate(`/artist?artist-id=${artist.id}`)}
                >
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
