import { useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';
import { usePlaylistsItemsQuery } from 'src/api/playlists';
import { TracksList } from 'src/components/TracksList';
import { useRecommendationTracksQuery, useSearchTracksQuery } from 'src/api/tracks';
import { PlaylistInfo } from 'src/pages/PlaylistsPage/components/PlaylistInfo';
import { Header } from 'src/components/Header';
import { ThemeBtn } from 'src/components/ThemeBtn';

type Props = {
  playlistId: string;
  isOwnPlaylist: boolean;
  showDeleteWindow: () => void;
};

export const PlayListTracks = ({ playlistId, isOwnPlaylist, showDeleteWindow }: Props): JSX.Element => {
  const { setCurrentUriTrack } = useContext(GlobalContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchedText = searchParams.get('query') ?? '';

  const { data: playlistItems, isLoading: isLoadingTracks } = usePlaylistsItemsQuery(playlistId);

  const { data: recommendedTracks, isLoading: isLoadingRecommendations } = useRecommendationTracksQuery();

  const { data: searchedTracks, isLoading: isLoadingSearch } = useSearchTracksQuery(searchedText, {
    enabled: !!searchedText,
  });

  const tracks = playlistItems?.items.map((item) => item.track);

  return (
    <div className='playlist-tracks d-flex flex-column w-100 h-100 justify-content-start align-items-center'>
      <div className='header-container d-flex flex-row justify-content-between p-3 w-100 align-items-center'>
        <div
          className='return-btn p-3 m-0 d-flex justify-content-between align-items-center text-white'
          onClick={() => {
            setCurrentUriTrack(null);

            setSearchParams((prev) => {
              prev.delete('playlist-id');
              prev.delete('query');
              return prev;
            });
          }}
        >
          <span className='fs-1'>&lt;</span>
          Back
        </div>
        {isOwnPlaylist ? <Header /> : <ThemeBtn />}
      </div>

      <PlaylistInfo playlistId={playlistId} showDeleteWindow={showDeleteWindow} isOwnPlaylist={isOwnPlaylist} />

      {!tracks?.length && !isLoadingTracks ? (
        <div className='empty-data d-flex flex-column justify-content-start align-items-center w-100 h-100'>
          <img className='empty-icon' src='/src/images/no-data.png' alt='empty' />
          <p className='fs-3 m-1'>Oops, not found anything</p>
        </div>
      ) : (
        <TracksList
          tracks={tracks ?? []}
          isLine={false}
          isLoading={isLoadingTracks}
          isInPlaylist={true}
          playlistId={playlistId}
          isOwnPlaylist={isOwnPlaylist}
        />
      )}

      {isOwnPlaylist && (!!searchedTracks?.length || !!recommendedTracks?.length) && (
        <>
          <h5 className='mt-4'>{searchedTracks ? 'Searched' : 'Recommended'} tracks</h5>
          <TracksList
            tracks={searchedTracks ?? recommendedTracks ?? []}
            isLine={true}
            isLoading={searchedText ? isLoadingSearch : isLoadingRecommendations}
            playlistId={playlistId}
            isOwnPlaylist={isOwnPlaylist}
            isInPlaylist={true}
          />
        </>
      )}
    </div>
  );
};
