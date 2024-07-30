import { Card } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { PlaylistType } from 'src/types/types';

type Props = {
  playlist: PlaylistType;
};

export const PlayList = ({ playlist }: Props): JSX.Element => {
  const [, setSearchParams] = useSearchParams();

  return (
    <Card
      className='playlist p-1 m-3 d-flex align-items-center justify-content-between text-white'
      onClick={() => setSearchParams({ 'playlist-id': playlist.id })}
    >
      <Card.Img
        src={playlist.images ? playlist.images[0].url : '/src/images/not-found.jpg'}
        className='playlist-icon mt-2'
      />
      <span className='fs-5 mb-2'>{playlist.name}</span>
    </Card>
  );
};
