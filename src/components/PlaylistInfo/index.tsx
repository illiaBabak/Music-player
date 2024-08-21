import { useState, useRef, useContext } from 'react';
import { usePlaylistQuery, useEditPlaylist } from 'src/api/playlists';
import { GlobalContext } from 'src/root';
import { MAX_IMG_SIZE } from 'src/utils/constants';

type Props = {
  playlistId: string;
  isOwnPlaylist: boolean;
  showDeleteWindow: () => void;
};

export const PlaylistInfo = ({ playlistId, isOwnPlaylist, showDeleteWindow }: Props): JSX.Element => {
  const { setAlertProps, isLightTheme, disablePlaylist, setImageToEdit } = useContext(GlobalContext);

  const { data: playlistData } = usePlaylistQuery(playlistId);
  const { mutateAsync: editPlaylist } = useEditPlaylist();

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const handleBlur = ({ currentTarget: { value, name } }: React.FocusEvent<HTMLInputElement, Element>) => {
    setIsEditingName(false);
    setIsEditingDescription(false);

    if (!playlistData?.name) {
      setAlertProps({ position: 'top', text: 'Name required', type: 'error' });

      return;
    }

    editPlaylist({ editedPlaylist: { [name]: value }, playlistId: playlistData?.id ?? '' });

    disablePlaylist(playlistData?.id ?? '');
  };

  const handleImageClick = () => {
    if (!inputFileRef.current) return;

    inputFileRef.current.click();
  };

  const handleImageUpload = ({ currentTarget: { files } }: React.ChangeEvent<HTMLInputElement>) => {
    if (!files) return;

    const file = files[0];
    const fileSize = file.size / 1024;

    if (fileSize >= MAX_IMG_SIZE) {
      setAlertProps({ text: 'Image is to large!', type: 'error', position: 'top' });
      return;
    }

    setImageToEdit(file);
  };

  return (
    <div className='playlist-info p-2 d-flex flex-row justify-content-center align-items-center w-100'>
      <div className='d-flex justify-content-center align-items-end'>
        <img
          src={playlistData?.images?.length ? playlistData.images[0].url : '/src/images/not-found.jpg'}
          className='playlist-icon mx-2'
          onClick={handleImageClick}
        />

        {isOwnPlaylist && <input type='file' className='img-input' ref={inputFileRef} onChange={handleImageUpload} />}
      </div>

      {isOwnPlaylist && (
        <img
          src={isLightTheme ? '/src/images/trash-icon-light.png' : '/src/images/trash-icon.png'}
          className='dlt-icon'
          onClick={showDeleteWindow}
        />
      )}
      <div className='d-flex flex-column w-100 h-100'>
        {isEditingName ? (
          <input
            key={playlistData?.name}
            className='info-field m-2 p-1'
            type='text'
            defaultValue={playlistData?.name}
            onBlur={handleBlur}
            onKeyDown={({ key, currentTarget }) => {
              if (key === 'Enter') currentTarget.blur();
            }}
            name='name'
            autoFocus
          />
        ) : (
          <span className={`fs-4 m-2 ${isOwnPlaylist ? '' : 'not-own'}`} onClick={() => setIsEditingName(true)}>
            {playlistData?.name ? playlistData?.name : 'Add name'}
          </span>
        )}

        {isEditingDescription ? (
          <input
            key={playlistData?.description}
            className='info-field m-2 p-1'
            type='text'
            defaultValue={playlistData?.description}
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
            {playlistData?.description ? playlistData.description : 'Add description'}
          </span>
        )}
      </div>
    </div>
  );
};
