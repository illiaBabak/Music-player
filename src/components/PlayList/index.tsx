import { useContext } from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from 'src/root';
import { PlaylistType } from 'src/types/types';

type Props = {
  playlist: PlaylistType;
  setSelectedPlaylistsId?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedPlaylistsId?: string[];
};

export const PlayList = ({ playlist, selectedPlaylistsId, setSelectedPlaylistsId }: Props): JSX.Element => {
  const { shouldShowPlaylists, disabledPlaylists } = useContext(GlobalContext);
  const navigate = useNavigate();

  const isDisabledPlaylist = disabledPlaylists.some((id) => playlist.id === id);

  const isSelectedPlaylist = selectedPlaylistsId?.some((id) => playlist.id === id);

  const handleSelectPlaylist = () => {
    if (setSelectedPlaylistsId) {
      setSelectedPlaylistsId((prev) =>
        prev.some((id) => id === playlist.id) ? prev.filter((id) => id !== playlist.id) : [...prev, playlist.id]
      );

      return;
    }

    navigate(`playlist?playlist-id=${playlist.id}`);
  };

  return (
    <Card
      className={`playlist p-1 m-3 d-flex align-items-center justify-content-between text-white overflow-hidden text-center ${isDisabledPlaylist ? 'disabled-playlist' : ''} ${isSelectedPlaylist && shouldShowPlaylists ? 'selected' : ''}`}
      onClick={handleSelectPlaylist}
    >
      <Card.Img
        src={playlist.images ? playlist.images[0].url : '/src/images/not-found.jpg'}
        className='playlist-icon mt-3 object-fit-cover'
      />
      <span className='fs-5 mb-2'>{isDisabledPlaylist ? 'Updating...' : playlist.name}</span>
    </Card>
  );
};
