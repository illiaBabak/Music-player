import { Button } from 'react-bootstrap';
import { PlayListsList } from '../PlayListsList';
import { useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAddItemsPlaylist } from 'src/api/playlists';
import { GlobalContext } from 'src/root';

type Props = {
  onClose: () => void;
};

export const PlaylistsModal = ({ onClose }: Props): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const { disablePlaylist } = useContext(GlobalContext);

  const trackUri = searchParams.get('track-to-add') ?? '';

  const { mutateAsync: addTrack } = useAddItemsPlaylist();

  const handleSubmit = () => {
    selectedPlaylists.map((id) => {
      addTrack({ playlistId: id, uris: [trackUri] });

      disablePlaylist(id);
    });

    setSelectedPlaylists([]);

    setSearchParams((prev) => {
      prev.delete('playlist-id');
      prev.delete('track-to-add');
      return prev;
    });

    onClose();
  };

  return (
    <div
      className='wrapper d-flex justify-content-center align-items-center'
      onClick={() => {
        setSearchParams((prev) => {
          prev.delete('track-to-add');
          return prev;
        });
        onClose();
      }}
    >
      <div
        className='playlists-window d-flex flex-column justify-content-center align-items-center'
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <PlayListsList
          showRecommendations={false}
          selectedPlaylists={selectedPlaylists}
          setSelectedPlaylists={setSelectedPlaylists}
        />
        <Button onClick={handleSubmit} className='save-btn mt-4'>
          Save
        </Button>
      </div>
    </div>
  );
};
