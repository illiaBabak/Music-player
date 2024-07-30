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
      className={`artist p-2 m-2 d-flex justify-content-center align-items-center text-white flex-column ${isLine ? 'line mx-4' : ''}`}
    >
      {!!artist.images.length && <Card.Img src={artist.images[0].url} className='artist-icon' />}
      <span className={`${isLine ? 'm-1' : 'm-3'} title text-white`}>{artist.name}</span>
    </Card>
  );
};
