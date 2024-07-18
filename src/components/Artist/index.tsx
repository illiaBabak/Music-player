import { useContext } from 'react';
import { Card } from 'react-bootstrap';
import { GlobalContext } from 'src/root';
import { ArtistType } from 'src/types/types';

type Props = {
  artist: ArtistType;
};

export const Artist = ({ artist }: Props): JSX.Element => {
  const { selectedChip } = useContext(GlobalContext);

  return (
    <Card
      className={`artist p-2 m-2 d-flex align-items-center text-white ${selectedChip === 'All' ? 'flex-row line' : 'flex-column'}`}
    >
      {!!artist.images.length && <Card.Img src={artist.images[0].url} className='artist-icon' />}
      <span className='m-3 title'>{artist.name}</span>

      {selectedChip !== 'All' && (
        <Card.Body className='d-flex flex-column justify-content-between'>
          {!!artist.genres.length && <div className='fs-6'>Genre: {artist.genres[0]}</div>}

          <p className='fs-6 m-0'>Followers: {artist.followers.total}</p>
        </Card.Body>
      )}
    </Card>
  );
};
