import { useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';
import { usePlaylistsItemsQuery } from 'src/api/playlists';
import { TracksList } from '../TracksList';
import { useRecommendationTracksQuery, useSearchTracksQuery } from 'src/api/tracks';
import { PlaylistInfo } from '../PlaylistInfo';
import { Header } from '../Header';
import { ThemeBtn } from '../ThemeBtn';

type Props = {
  playlistId: string;
  isOwnPlaylist: boolean;
  showDeleteWindow: () => void;
};

export const PlayListTracks = ({ playlistId, isOwnPlaylist, showDeleteWindow }: Props): JSX.Element => {
  const { setCurrentUriTrack } = useContext(GlobalContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchedText = searchParams.get('query') ?? '';

  const { data: playlistItems, isFetching: isFetchingTracks } = usePlaylistsItemsQuery(playlistId);

  const { data: recommendedTracks, isFetching: isFetchingRecommendations } = useRecommendationTracksQuery();

  const { data: searchedTracks, isFetching: isFetchingSearch } = useSearchTracksQuery(searchedText, {
    enabled: !!searchedText,
  });

  const tracks = playlistItems?.items.map((item) => item.track);

  return (
    <div className='playlist-tracks d-flex flex-column w-100 h-100 justify-content-start align-items-center'>
      <div className='header-container d-flex flex-row justify-content-between p-3 w-100 align-items-center'>
        <div
          className='return-btn p-3 m-0 d-flex justify-content-center align-items-center'
          onClick={() => {
            setCurrentUriTrack(null);

            setSearchParams((prev) => {
              prev.delete('playlist-id');
              prev.delete('query');
              return prev;
            });
          }}
        >
          Back
        </div>
        {isOwnPlaylist ? <Header /> : <ThemeBtn />}
      </div>

      <PlaylistInfo playlistId={playlistId} showDeleteWindow={showDeleteWindow} isOwnPlaylist={isOwnPlaylist} />

      {tracks?.length ? (
        <TracksList
          tracks={tracks}
          isLine={false}
          isLoading={isFetchingTracks}
          isTracksInPlaylist={true}
          playlistId={playlistId}
        />
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

      {!!searchedTracks?.length && isOwnPlaylist && (
        <>
          <h5 className='mt-4'>Searhed tracks</h5>
          <TracksList tracks={searchedTracks} isLine={true} isLoading={isFetchingSearch} playlistId={playlistId} />
        </>
      )}
    </div>
  );
};
