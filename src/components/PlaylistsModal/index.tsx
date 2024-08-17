import { Button } from 'react-bootstrap';
import { PlayListsList } from '../PlayListsList';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAddItemsPlaylist } from 'src/api/playlists';
import { ModalWrapper } from '../ModalWrapper';

type Props = {
  onClose: () => void;
};

export const PlaylistsModal = ({ onClose }: Props): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPlaylistsId, setSelectedPlaylistsId] = useState<string[]>([]);

  const trackUri = searchParams.get('track-to-add') ?? '';

  const { mutateAsync: addTrack } = useAddItemsPlaylist();

  const handleSubmit = () => {
    selectedPlaylistsId.map((id) => {
      addTrack({ playlistId: id, uris: [trackUri] });
    });

    setSelectedPlaylistsId([]);

    setSearchParams((prev) => {
      prev.delete('playlist-id');
      prev.delete('track-to-add');
      return prev;
    });

    onClose();
  };

  return (
    <ModalWrapper
      onClose={() => {
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
          selectedPlaylistsId={selectedPlaylistsId}
          setSelectedPlaylistsId={setSelectedPlaylistsId}
        />
        <Button onClick={handleSubmit} className='save-btn mt-4'>
          Save
        </Button>
      </div>
    </ModalWrapper>
  );
};
