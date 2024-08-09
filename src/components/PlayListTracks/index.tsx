import { useSearchParams } from 'react-router-dom';
import { ThemeBtn } from '../ThemeBtn';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from 'src/root';
import { useEditPlaylist, usePlaylistQuery, usePlaylistsItemsQuery } from 'src/api/playlists';
import { TracksList } from '../TracksList';
import { PlaylistType } from 'src/types/types';
import { Button, Dropdown } from 'react-bootstrap';

type Props = {
  playlistId: string;
  isOwnPlaylist: boolean;
  showDeleteWindow: () => void;
  disablePlaylist: (playlistId: string) => void;
};

export const PlayListTracks = ({
  playlistId,
  isOwnPlaylist,
  showDeleteWindow,
  disablePlaylist,
}: Props): JSX.Element => {
  const { setCurrentUriTrack, setAlertProps } = useContext(GlobalContext);
  const [, setSearchParams] = useSearchParams();

  const { data: playlistItems, isFetching: isFetchingTracks } = usePlaylistsItemsQuery(playlistId);
  const { data: playlistData } = usePlaylistQuery(playlistId);

  const { mutateAsync: editPlaylist } = useEditPlaylist();

  const tracks = playlistItems?.items.map((item) => item.track);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Partial<PlaylistType>>({
    name: playlistData?.name,
    description: playlistData?.description,
    public: playlistData?.public,
  });

  const isEditedPlaylist =
    editingPlaylist.name === playlistData?.name &&
    editingPlaylist.description === playlistData?.description &&
    editingPlaylist.public === playlistData?.public;

  useEffect(() => {
    setEditingPlaylist({ ...playlistData });
  }, [playlistData]);

  const handleInputChange = ({ currentTarget: { value, name } }: React.ChangeEvent<HTMLInputElement>) => {
    setEditingPlaylist((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = () => {
    setIsEditingName(false);
    setIsEditingDescription(false);
  };

  const handleSubmitChanges = () => {
    if (!editingPlaylist.name) {
      setAlertProps({ position: 'top', text: 'Name required', type: 'error' });

      return;
    }

    editPlaylist({ editedPlaylist: editingPlaylist, playlistId: playlistData?.id ?? '' });

    disablePlaylist(playlistData?.id ?? '');

    setSearchParams((prev) => {
      prev.delete('playlist-id');

      return prev;
    });
  };

  return (
    <div className='playlist-tracks d-flex flex-column w-100 h-100 justify-content-start'>
      <div className='header d-flex flex-row justify-content-between p-3 w-100 align-items-center'>
        <div
          className='return-btn p-3 m-0 d-flex justify-content-center align-items-center'
          onClick={() => {
            setCurrentUriTrack(null);

            setSearchParams((prev) => {
              prev.delete('playlist-id');
              return prev;
            });
          }}
        >
          Back
        </div>
        <ThemeBtn />
      </div>

      <div className='playlist-info p-2 d-flex flex-row justify-content-center align-items-center w-100'>
        <div className='d-flex justify-content-center align-items-end'>
          <img
            src={playlistData?.images ? playlistData.images[0].url : '/src/images/not-found.jpg'}
            className='playlist-icon mx-2'
          />

          {isOwnPlaylist && <img src='/src/images/trash.png' className='dlt-icon' onClick={showDeleteWindow} />}
        </div>

        <div className='d-flex flex-column w-100 h-100'>
          {isEditingName ? (
            <input
              className='info-field m-2 p-1'
              type='text'
              value={editingPlaylist?.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={({ key, currentTarget }) => {
                if (key === 'Enter') currentTarget.blur();
              }}
              name='name'
              autoFocus
            />
          ) : (
            <span className={`fs-4 m-2 ${isOwnPlaylist ? '' : 'not-own'}`} onClick={() => setIsEditingName(true)}>
              {editingPlaylist?.name ? editingPlaylist.name : 'Add name'}
            </span>
          )}

          {isEditingDescription ? (
            <input
              className='info-field m-2 p-1'
              type='text'
              value={editingPlaylist?.description}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={({ key, currentTarget }) => {
                if (key === 'Enter') currentTarget.blur();
              }}
              name='description'
              autoFocus
              placeholder='Add description...'
            />
          ) : (
            <span
              className={`fs-6 m-2 ${isOwnPlaylist ? '' : 'not-own'}`}
              onClick={() => {
                setIsEditingDescription(true);
              }}
            >
              {editingPlaylist.description ? editingPlaylist?.description : 'Add description'}
            </span>
          )}

          {isOwnPlaylist && (
            <Dropdown
              className='m-2 mt-3'
              onSelect={(option) => {
                setEditingPlaylist((prev) => ({
                  ...prev,
                  public: option === 'Public',
                }));
              }}
            >
              <Dropdown.Toggle className='dropdown-text'>
                {editingPlaylist.public ? 'Public' : 'Private'}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey='Public'>Public</Dropdown.Item>
                <Dropdown.Item eventKey='Private'>Private</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>

        <Button disabled={isEditedPlaylist} onClick={handleSubmitChanges}>
          Save changes
        </Button>
      </div>

      <TracksList tracks={tracks ?? []} isLine={false} isLoading={isFetchingTracks} />
    </div>
  );
};
