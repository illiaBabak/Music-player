import { useContext } from 'react';
import { Card } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { GlobalContext } from 'src/root';
import { PlaylistType } from 'src/types/types';

type Props = {
  playlist: PlaylistType;
  setSelectedPlaylists?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedPlaylists?: string[];
};

export const PlayList = ({ playlist, selectedPlaylists, setSelectedPlaylists }: Props): JSX.Element => {
  const { shouldShowPlaylists, disabledPlaylists } = useContext(GlobalContext);
  const [, setSearchParams] = useSearchParams();

  const isDisabledPlaylist = disabledPlaylists.some((id) => playlist.id === id);

  return (
    <Card
      className={`playlist p-1 m-3 d-flex align-items-center justify-content-between text-white ${isDisabledPlaylist ? 'disabled-playlist' : ''} ${selectedPlaylists?.some((id) => playlist.id === id) && shouldShowPlaylists ? 'selected' : ''}`}
      onClick={() => {
        {
          setSelectedPlaylists &&
            setSelectedPlaylists((prev) => {
              if (prev.some((id) => id === playlist.id)) return prev.filter((id) => id !== playlist.id);
              else return [...prev, playlist.id];
            });
        }

        setSearchParams((prev) => {
          prev.set('playlist-id', playlist.id);
          return prev;
        });
      }}
    >
      <Card.Img
        src={playlist.images ? playlist.images[0].url : '/src/images/not-found.jpg'}
        className='playlist-icon mt-2'
      />
      <span className='fs-5 mb-2'>{isDisabledPlaylist ? 'Updating...' : playlist.name}</span>
      {selectedPlaylists?.some((id) => playlist.id === id) && <span className='fs-1 mb-2 selected-text'>Selected</span>}
    </Card>
  );
};
