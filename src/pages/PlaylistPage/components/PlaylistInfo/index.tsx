import { useRef, useContext } from 'react';
import { usePlaylistQuery, useEditPlaylist } from 'src/api/playlists';
import { GlobalContext } from 'src/root';
import { MAX_IMG_SIZE } from 'src/utils/constants';
import { ChangedField } from 'src/components/ChangedField';
import { SkeletonLoader } from 'src/components/SkeletonLoader';
import { useGetElSize } from 'src/hooks/useGetElSize';

type Props = {
  playlistId: string;
  isOwnPlaylist: boolean;
  showDeleteWindow: () => void;
};

export const PlaylistInfo = ({ playlistId, isOwnPlaylist, showDeleteWindow }: Props): JSX.Element => {
  const { setAlertProps, isLightTheme, disablePlaylist, setImageToEdit, isMobile } = useContext(GlobalContext);

  const { data: playlistData, isLoading: isLoadingPlaylist } = usePlaylistQuery(playlistId);
  const { mutateAsync: editPlaylist } = useEditPlaylist();

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const handleBlur = ({ currentTarget: { value, name } }: React.FocusEvent<HTMLInputElement, Element>) => {
    if (!playlistData?.name) {
      setAlertProps({ position: 'top', text: 'Name required', type: 'error' });

      return;
    }

    editPlaylist({ [name]: value, id: playlistData.id ?? '' });

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

  const changedFieldRef = useRef<HTMLInputElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const { width: fieldWidth, height: fieldHeight } = useGetElSize(changedFieldRef);
  const { width: imgWidth, height: imgHeight } = useGetElSize(imgRef);

  return (
    <div
      className={`playlist-info d-flex p-2 flex-row justify-content-center align-items-center w-100 position-relative`}
    >
      <div className='d-flex justify-content-center align-items-end'>
        {isLoadingPlaylist ? (
          <SkeletonLoader width={imgWidth} height={imgHeight} borderRadius='50%' className='mx-2' />
        ) : (
          <img
            src={playlistData?.images?.length ? playlistData.images[0].url : '/src/images/not-found.jpg'}
            className='playlist-icon mx-2 object-fit-cover rounded-circle'
            onClick={handleImageClick}
          />
        )}

        {isOwnPlaylist && <input type='file' className='img-input' ref={inputFileRef} onChange={handleImageUpload} />}
      </div>

      {isOwnPlaylist && (
        <img
          src={isLightTheme ? '/src/images/trash-icon-light.png' : '/src/images/trash-icon.png'}
          className='dlt-icon position-absolute p-1 object-fit-cover'
          onClick={showDeleteWindow}
        />
      )}

      <div className='invisible position-absolute'>
        //* empty elements just to calc skeleton size
        <img className='playlist-icon object-fit-cover position-absolute invisible' ref={imgRef} />
        <ChangedField handleBlur={() => {}} isReadOnly={true} data={''} name='' ref={changedFieldRef} />
      </div>

      <div className='d-flex flex-column w-100 h-100'>
        {isLoadingPlaylist ? (
          <SkeletonLoader
            width={fieldWidth}
            height={fieldHeight}
            borderRadius='2px'
            className={`${isMobile ? 'm-1' : 'm-2 p-1'}`}
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
            width={fieldWidth}
            height={fieldHeight}
            borderRadius='2px'
            className={`${isMobile ? 'm-1' : 'm-2 p-1'}`}
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
