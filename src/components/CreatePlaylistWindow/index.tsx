import { useState } from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import { useAddPlaylist } from 'src/api/playlists';
import { useUserQuery } from 'src/api/user';
import { PlaylistType } from 'src/types/types';

type Props = {
  onClose: () => void;
};

const DEFAULT_VALUE: Partial<PlaylistType> = {
  name: '',
  description: '',
  public: true,
};

export const CreatePlaylistWindow = ({ onClose }: Props): JSX.Element => {
  const [playlistToCreate, setPlaylistToCreate] = useState<Partial<PlaylistType>>(DEFAULT_VALUE);

  const { data: user } = useUserQuery();

  const { mutateAsync: createPlaylist } = useAddPlaylist();

  const handleChangeField = ({ currentTarget: { value, name } }: React.ChangeEvent<HTMLInputElement>) => {
    setPlaylistToCreate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectPrivacy = (eventKey: string | null) => {
    setPlaylistToCreate((prev) => ({
      ...prev,
      public: eventKey === 'Public',
    }));
  };

  const handleSubmit = () => {
    createPlaylist({ playlistToCreate, userId: user?.id ?? '' });

    setPlaylistToCreate(DEFAULT_VALUE);

    onClose();
  };

  return (
    <div className='wrapper d-flex justify-content-center align-items-center' onClick={onClose}>
      <div
        className='create-window d-flex flex-column justify-content-between align-items-center text-white p-4'
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <h2>Create a playlist</h2>

        <div className='d-flex flex-column align-items-center'>
          <div className='m-2 mt-4 w-100 d-flex justify-content-between align-items-center'>
            <span className='fs-4'>Name</span>
            <input
              className='field p-1'
              type='text'
              name='name'
              value={playlistToCreate.name}
              onChange={handleChangeField}
            />
          </div>

          <div className='m-2 mt-4 w-100 d-flex justify-content-between align-items-center'>
            <span className='fs-4'>Description</span>
            <input
              className='field p-1'
              type='text'
              name='description'
              value={playlistToCreate.description}
              onChange={handleChangeField}
            />
          </div>

          <Dropdown className='m-2 mt-4' onSelect={handleSelectPrivacy}>
            <Dropdown.Toggle className='dropdown-text'>
              {playlistToCreate.public ? 'Public' : 'Private'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey='Public'>Public</Dropdown.Item>
              <Dropdown.Item eventKey='Private'>Private</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className='d-flex flex-row'>
          <Button variant='success m-2' disabled={!playlistToCreate.name} onClick={handleSubmit}>
            Create
          </Button>
          <Button
            variant='danger m-2'
            onClick={() => {
              setPlaylistToCreate(DEFAULT_VALUE);

              onClose();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
