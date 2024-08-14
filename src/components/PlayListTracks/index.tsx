import { useSearchParams } from 'react-router-dom';
import { ThemeBtn } from '../ThemeBtn';
import { useContext, useEffect, useRef, useState } from 'react';
import { GlobalContext } from 'src/root';
import { useCustomImagePlaylist, useEditPlaylist, usePlaylistQuery, usePlaylistsItemsQuery } from 'src/api/playlists';
import { TracksList } from '../TracksList';
import { PlaylistType } from 'src/types/types';
import { isString } from 'src/utils/guards';
import { useRecommendationTracksQuery } from 'src/api/tracks';

type Props = {
  playlistId: string;
  isOwnPlaylist: boolean;
  showDeleteWindow: () => void;
};

export const PlayListTracks = ({ playlistId, isOwnPlaylist, showDeleteWindow }: Props): JSX.Element => {
  const { setCurrentUriTrack, setAlertProps, disablePlaylist, isLightTheme } = useContext(GlobalContext);
  const [, setSearchParams] = useSearchParams();

  const { data: playlistItems, isFetching: isFetchingTracks } = usePlaylistsItemsQuery(playlistId);
  const { data: playlistData } = usePlaylistQuery(playlistId);
  const { data: recommendedTracks, isFetching: isFetchingRecommendations } = useRecommendationTracksQuery();

  const { mutateAsync: editPlaylist } = useEditPlaylist();
  const { mutateAsync: addCustomImagePlaylist } = useCustomImagePlaylist();

  const tracks = playlistItems?.items.map((item) => item.track);

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

    if (!editingPlaylist.images?.[0].url)
      addCustomImagePlaylist({ playlistId: playlistData?.id ?? '', image: editingPlaylist.images?.[0].url ?? '' });

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

    reader.onload = (e) => {
      const base64String = e.target?.result;

      if (isString(base64String)) setEditingPlaylist((prev) => ({ ...prev, images: [{ url: base64String }] }));
    };

    if (files[0]) reader.readAsDataURL(files[0]);
  };

  return (
    <div className='playlist-tracks d-flex flex-column w-100 h-100 justify-content-start align-items-center'>
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
            src={editingPlaylist.images?.length ? editingPlaylist.images[0].url : '/src/images/not-found.jpg'}
            className='playlist-icon mx-2'
            onClick={handleImageClick}
          />

          {isOwnPlaylist && <input type='file' className='img-input' ref={inputFileRef} onChange={handleImageUpload} />}
        </div>

        {isOwnPlaylist && (
          <img
            src={isLightTheme ? '/src/images/trash.png' : '/src/images/dark-trash-icon.png'}
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

      {tracks?.length ? (
        <TracksList tracks={tracks} isLine={false} isLoading={isFetchingTracks} isTracksInPlaylist={true} />
      ) : (
        <div className='fs-2 mt-4'>No tracks :(</div>
      )}

      {!!recommendedTracks?.length && isOwnPlaylist && (
        <>
          <h5 className='mt-4'>Recommended tracks</h5>
          <TracksList
            tracks={recommendedTracks}
            isLine={true}
            isLoading={isFetchingRecommendations}
            playlistId={playlistId}
          />
        </>
      )}
    </div>
  );
};
