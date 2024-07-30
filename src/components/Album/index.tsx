import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AlbumType } from 'src/types/types';

type Props = {
  album: AlbumType;
  isLine: boolean;
};

export const Album = ({ album, isLine }: Props): JSX.Element => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/album?album-id=${album.id}`)}
      className={`album p-2 m-2 d-flex align-items-center text-white ${isLine ? 'line mx-3' : ''}`}
    >
      <Card.Img src={album.images[0].url} className='album-icon' />
      <span className={`${isLine ? 'm-1 mt-2' : 'm-3'} title`}>{album.name}</span>

      {!isLine && (
        <Card.Body className='album-body p-0 d-flex flex-column justify-content-between align-items-center w-100'>
          <div className='m-2 artists d-flex flex-row justify-content-center flex-wrap w-100'>
            {album.artists.map((artist, index) => (
              <p
                onClick={() => navigate(`/artist?artist-id=${artist.id}`)}
                key={`album-artist-${index}`}
                className='m-1 artist-album'
              >
                {artist.name}
              </p>
            ))}
          </div>

          <div>
            <p className='m-0 description'>Tracks: {album.total_tracks}</p>
          </div>
        </Card.Body>
      )}
    </Card>
  );
};
