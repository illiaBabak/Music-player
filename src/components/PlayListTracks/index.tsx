import { useSearchParams } from 'react-router-dom';
import { ThemeBtn } from '../ThemeBtn';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';
import { usePlaylistQuery, usePlaylistsItemsQuery } from 'src/api/playlists';
import { TracksList } from '../TracksList';

type Props = {
  playlistId: string;
};

export const PlayListTracks = ({ playlistId }: Props): JSX.Element => {
  const { setCurrentUriTrack } = useContext(GlobalContext);
  const [, setSearchParams] = useSearchParams();

  const { data: playlistItems, isFetching: isFetchingTracks } = usePlaylistsItemsQuery(playlistId);
  const { data: playlistData } = usePlaylistQuery(playlistId);

  const tracks = playlistItems?.items.map((item) => item.track);

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
        <img
          src={playlistData?.images ? playlistData.images[0].url : '/src/images/not-found.jpg'}
          className='playlist-icon mx-2'
        />
        <div className='details d-flex flex-column w-100'>
          <span className='fs-4 m-2'>{playlistData?.name}</span>
          <span className='fs-6 m-2'>{playlistData?.description}</span>
        </div>
      </div>

      <TracksList tracks={tracks ?? []} isLine={false} isLoading={isFetchingTracks} />
    </div>
  );
};
