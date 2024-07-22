import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ArtistType } from 'src/types/types';

type Props = {
  artist: ArtistType;
  isLine: boolean;
};

export const Artist = ({ artist, isLine }: Props): JSX.Element => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/artist?artist-id=${artist.id}`)}
      className={`artist p-2 m-2 d-flex align-items-center text-white ${isLine ? 'flex-row line' : 'flex-column'}`}
    >
      {!!artist.images.length && <Card.Img src={artist.images[0].url} className='artist-icon' />}
      <span className='m-3 title'>{artist.name}</span>

      {!isLine && (
        <Card.Body className='d-flex flex-column justify-content-between'>
          {!!artist.genres.length && <div className='fs-6'>Genre: {artist.genres[0]}</div>}

          <p className='fs-6 m-0'>Followers: {artist.followers.total}</p>
        </Card.Body>
      )}
    </Card>
  );
};
