import { useFeaturedPlaylistsQuery, usePlaylistsQuery } from 'src/api/playlists';
import { PlayList } from '../PlayList';
import { useSearchParams } from 'react-router-dom';
import { PlaylistType } from 'src/types/types';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';
import { SkeletonLoader } from '../SkeletonLoader';
import { Player } from '../Player';

type Props = {
  showRecommendations: boolean;
  setSelectedPlaylistsId?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedPlaylistsId?: string[];
};

const isPlaylistContainsText = (playlist: PlaylistType, text: string) =>
  playlist.name.toLocaleLowerCase().includes(text.toLocaleLowerCase());

export const PlayListsList = ({
  showRecommendations,
  setSelectedPlaylistsId,
  selectedPlaylistsId,
}: Props): JSX.Element => {
  const { isMobile, currentUriTrack } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();

  const searchedText = searchParams.get('query') ?? '';

  const { data: playlists, isLoading: isLoadingPlaylists } = usePlaylistsQuery({
    enabled: !showRecommendations,
    staleTime: 60000,
  });
  const { data: featuredPlaylists, isLoading: isLoadingFeaturedPlaylists } = useFeaturedPlaylistsQuery({
    enabled: showRecommendations,
  });

  const filteredPlaylists = searchedText
    ? (showRecommendations ? featuredPlaylists : playlists)?.filter((playlist) =>
        isPlaylistContainsText(playlist, searchedText)
      )
    : showRecommendations
      ? featuredPlaylists
      : playlists;

  return (
    <div
      className={`playlists-list scroll-container d-flex flex-row flex-wrap align-items-center justify-content-center w-100 ${isMobile ? 'p-0' : ''} ${currentUriTrack ? 'playing' : ''}`}
    >
      {isLoadingPlaylists || isLoadingFeaturedPlaylists
        ? Array.from({ length: 20 }).map((_, index) => (
            <SkeletonLoader key={`playlist-skeleton-${index}`} className={`playlist ${isMobile ? 'm-2' : 'm-3'} p-1`} />
          ))
        : filteredPlaylists?.map((playlist, index) => (
            <PlayList
              key={`${playlist.id ?? ''}-${index}`}
              playlist={playlist}
              setSelectedPlaylistsId={setSelectedPlaylistsId}
              selectedPlaylistsId={selectedPlaylistsId}
            />
          ))}

      {!!currentUriTrack && <Player />}
    </div>
  );
};
