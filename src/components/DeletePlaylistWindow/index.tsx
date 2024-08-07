import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDeletePlaylist } from 'src/api/playlists';

type Props = {
  onClose: () => void;
  playlistId: string;
};

export const DeletePlaylistWindow = ({ onClose, playlistId }: Props): JSX.Element => {
  const navigate = useNavigate();

  const { mutateAsync: deletePlaylist } = useDeletePlaylist();

  const handleDelete = () => {
    deletePlaylist(playlistId);

    onClose();

    navigate('/home');
  };

  return (
    <div className='wrapper d-flex justify-content-center align-items-center' onClick={onClose}>
      <div
        className='delete-window d-flex flex-column justify-content-between align-items-center text-white p-4'
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <h3>Are you sure you want to delete the playlist?</h3>

        <div className='d-flex flex-row'>
          <Button variant='danger m-2' onClick={handleDelete}>
            Delete
          </Button>
          <Button className='cancel-btn' variant='dark m-2' onClick={() => onClose()}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
