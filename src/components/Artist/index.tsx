import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ArtistType } from 'src/types/types';
import { FollowArtistBtn } from '../FollowArtistBtn';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';

type Props = {
  artist: ArtistType;
  isLine: boolean;
};

export const Artist = ({ artist, isLine }: Props): JSX.Element => {
  const { isMobile } = useContext(GlobalContext);
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/artist?artist-id=${artist.id}`)}
      className={`artist p-2 m-2 d-flex justify-content-center align-items-center text-white flex-column text-center rounded-circle ${!isMobile && isLine ? 'mx-4' : ''} ${isLine ? 'line' : ''}`}
    >
      <Card.Img
        src={artist.images.length ? artist.images[0].url : '/src/images/not-found.jpg'}
        className='artist-icon object-fit-cover rounded-circle'
      />

      <span className={`${isLine ? 'm-1' : 'm-3'} title text-white m-2`}>{artist.name}</span>

      <FollowArtistBtn artist={artist} />
    </Card>
  );
};
