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

export const PlaylistInfo = ({ playlistId, isOwnPlaylist, showDeleteWindow }: Props): JSX.Element => {
  const { setAlertProps, isLightTheme, disablePlaylist, setImageToEdit, isTablet } = useContext(GlobalContext);

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

  const skeletonFieldWidthDesktop = '450px';

  const skeletonFieldWidthTablet = '300px';

  return (
    <div className='playlist-info p-2 d-flex flex-row justify-content-center align-items-center w-100 position-relative'>
      <div className='d-flex justify-content-center align-items-end'>
        {isLoadingPlaylist ? (
          <SkeletonLoader width='140px' height='140px' borderRadius='50%' className='mx-2' />
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

      <div className='d-flex flex-column w-100 h-100'>
        {isLoadingPlaylist ? (
          <SkeletonLoader
            width={isTablet ? skeletonFieldWidthTablet : skeletonFieldWidthDesktop}
            height='32px'
            borderRadius='2px'
            className='m-2 p-1'
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
            width={isTablet ? skeletonFieldWidthTablet : skeletonFieldWidthDesktop}
            height='32px'
            borderRadius='2px'
            className='m-2 p-1'
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
