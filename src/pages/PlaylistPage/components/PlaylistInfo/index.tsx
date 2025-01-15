import { useRef, useContext } from 'react';
import { usePlaylistQuery, useEditPlaylist } from 'src/api/playlists';
import { GlobalContext } from 'src/root';
import { MAX_IMG_SIZE } from 'src/utils/constants';
import { ChangedField } from 'src/components/ChangedField';
import { SkeletonLoader } from 'src/components/SkeletonLoader';

type Props = {
  playlistId: string;
  isOwnPlaylist: boolean;
  showDeleteWindow: () => void;
};

export const PlaylistInfo = ({
  playlistId,
  isOwnPlaylist,
  showDeleteWindow,
}: Props): JSX.Element => {
  const { setAlertProps, isLightTheme, setImageToEdit, isMobile } =
    useContext(GlobalContext);

  const { data: playlistData, isLoading: isLoadingPlaylist } =
    usePlaylistQuery(playlistId);
  const { mutateAsync: editPlaylist } = useEditPlaylist(playlistId);

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const handleBlur = ({
    currentTarget: { value, name },
  }: React.FocusEvent<HTMLInputElement, Element>) => {
    if (!playlistData?.name) {
      setAlertProps({ position: 'top', text: 'Name required', type: 'error' });

      return;
    }

    editPlaylist({ [name]: value, id: playlistData.id ?? '' });
  };

  const handleImageClick = () => {
    if (!inputFileRef.current) return;

    inputFileRef.current.click();
  };

  const handleImageUpload = ({
    currentTarget: { files },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (!files) return;

    const file = files[0];
    const fileSize = file.size / 1024;

    if (fileSize >= MAX_IMG_SIZE) {
      setAlertProps({
        text: 'Image is to large!',
        type: 'error',
        position: 'top',
      });
      return;
    }

    setImageToEdit(file);
  };

  return (
    <div
      className={`playlist-info d-flex p-2 flex-row justify-content-center align-items-center w-100 position-relative`}
    >
      <div className='d-flex justify-content-center align-items-end'>
        {isLoadingPlaylist ? (
          <SkeletonLoader className='mx-2 playlist-icon rounded-circle' />
        ) : (
          <img
            src={
              playlistData?.images?.length
                ? playlistData.images[0].url
                : '/not-found.jpg'
            }
            className='playlist-icon mx-2 object-fit-cover rounded-circle'
            onClick={handleImageClick}
          />
        )}

        {isOwnPlaylist && (
          <input
            type='file'
            className='img-input'
            ref={inputFileRef}
            onChange={handleImageUpload}
          />
        )}
      </div>

      {isOwnPlaylist && (
        <img
          src={isLightTheme ? '/trash-icon-light.png' : '/trash-icon.png'}
          className='dlt-icon position-absolute p-1 object-fit-cover'
          onClick={showDeleteWindow}
        />
      )}

      <div className='d-flex flex-column w-100 h-100'>
        {isLoadingPlaylist ? (
          <SkeletonLoader
            className={`info-field ${isMobile ? 'm-1' : 'm-2 p-1'}`}
          />
        ) : (
          <ChangedField
            handleBlur={handleBlur}
            isReadOnly={isOwnPlaylist}
            data={playlistData?.name ?? ''}
            name='name'
          />
        )}

        {isLoadingPlaylist ? (
          <SkeletonLoader
            className={`info-field ${isMobile ? 'm-1' : 'm-2 p-1'}`}
          />
        ) : (
          <ChangedField
            handleBlur={handleBlur}
            isReadOnly={isOwnPlaylist}
            data={playlistData?.description ?? ''}
            name='description'
          />
        )}
      </div>
    </div>
  );
};
