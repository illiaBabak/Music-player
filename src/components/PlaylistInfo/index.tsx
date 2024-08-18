import { useState, useRef, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePlaylistQuery, useEditPlaylist, useCustomImagePlaylist } from 'src/api/playlists';
import { GlobalContext } from 'src/root';
import { PlaylistType } from 'src/types/types';
import { MAX_IMG_SIZE } from 'src/utils/constants';
import { isString } from 'src/utils/guards';

type Props = {
  playlistId: string;
  isOwnPlaylist: boolean;
  showDeleteWindow: () => void;
};

export const PlaylistInfo = ({ playlistId, isOwnPlaylist, showDeleteWindow }: Props): JSX.Element => {
  const { setAlertProps, isLightTheme, disablePlaylist } = useContext(GlobalContext);
  const [, setSearchParams] = useSearchParams();

  const { data: playlistData } = usePlaylistQuery(playlistId);

  const { mutateAsync: editPlaylist } = useEditPlaylist();
  const { mutateAsync: addCustomImagePlaylist } = useCustomImagePlaylist();

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Partial<PlaylistType>>({
    name: playlistData?.name,
    description: playlistData?.description,
    images: playlistData?.images,
  });

  const inputFileRef = useRef<HTMLInputElement | null>(null);

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

  const handleImageClick = () => {
    if (!inputFileRef.current) return;

    inputFileRef.current.click();
  };

  const handleImageUpload = ({ currentTarget: { files } }: React.ChangeEvent<HTMLInputElement>) => {
    if (!files) return;

    const reader = new FileReader();

    const file = files[0];
    const fileSize = file.size / 1024;

    if (fileSize >= MAX_IMG_SIZE) {
      setAlertProps({ text: 'Image is to large!', type: 'error', position: 'top' });
      return;
    }

    reader.onload = (e) => {
      const base64String = e.target?.result;

      if (isString(base64String)) {
        setEditingPlaylist((prev) => ({ ...prev, images: [{ url: base64String }] }));

        addCustomImagePlaylist({ playlistId: playlistData?.id ?? '', image: base64String });
      }
    };

    if (file) reader.readAsDataURL(file);
  };

  return (
    <div className='playlist-info p-2 d-flex flex-row justify-content-center align-items-center w-100'>
      <div className='d-flex justify-content-center align-items-end'>
        <img
          src={editingPlaylist.images?.length ? editingPlaylist.images[0].url : '/src/images/not-found.jpg'}
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
      </div>
    </div>
  );
};
