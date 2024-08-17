import { useContext } from 'react';
import { Card } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { GlobalContext } from 'src/root';
import { PlaylistType } from 'src/types/types';

type Props = {
  playlist: PlaylistType;
  setSelectedPlaylistsId?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedPlaylistsId?: string[];
};

export const PlayList = ({ playlist, selectedPlaylistsId, setSelectedPlaylistsId }: Props): JSX.Element => {
  const { shouldShowPlaylists, disabledPlaylists } = useContext(GlobalContext);
  const [, setSearchParams] = useSearchParams();

  const isDisabledPlaylist = disabledPlaylists.some((id) => playlist.id === id);

  const isSelectedPlaylist = selectedPlaylistsId?.some((id) => playlist.id === id);

  const handleSelectPlaylist = () => {
    setSelectedPlaylistsId &&
      setSelectedPlaylistsId((prev) =>
        prev.some((id) => id === playlist.id) ? prev.filter((id) => id !== playlist.id) : [...prev, playlist.id]
      );

    setSearchParams((prev) => {
      prev.set('playlist-id', playlist.id);
      return prev;
    });
  };

  return (
    <Card
      className={`playlist p-1 m-3 d-flex align-items-center justify-content-between text-white ${isDisabledPlaylist ? 'disabled-playlist' : ''} ${isSelectedPlaylist && shouldShowPlaylists ? 'selected' : ''}`}
      onClick={handleSelectPlaylist}
    >
      <Card.Img
        src={playlist.images ? playlist.images[0].url : '/src/images/not-found.jpg'}
        className='playlist-icon mt-2'
      />
      <span className='fs-5 mb-2'>{isDisabledPlaylist ? 'Updating...' : playlist.name}</span>
      {isSelectedPlaylist && <span className='fs-1 mb-2 selected-text'>Selected</span>}
    </Card>
  );
};
