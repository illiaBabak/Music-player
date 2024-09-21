import { useFeaturedPlaylistsQuery, usePlaylistsQuery } from 'src/api/playlists';
import { PlayList } from '../PlayList';
import { useSearchParams } from 'react-router-dom';
import { PlaylistType } from 'src/types/types';
import { useContext, useEffect, useRef } from 'react';
import { GlobalContext } from 'src/root';
import { SkeletonLoader } from '../SkeletonLoader';
import { Player } from '../Player';
import { useGetElSize } from 'src/hooks/useGetElSize';

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
  const { disabledPlaylists, isMobile, currentUriTrack } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();

  const searchedText = searchParams.get('query') ?? '';

  const {
    data: playlists,
    isLoading: isLoadingPlaylists,
    refetch,
  } = usePlaylistsQuery({ enabled: !showRecommendations });
  const { data: featuredPlaylists, isLoading: isLoadingFeaturedPlaylists } = useFeaturedPlaylistsQuery({
    enabled: showRecommendations,
  });

  useEffect(() => {
    refetch();
  }, [disabledPlaylists, refetch]);

  const filteredPlaylists = searchedText
    ? (showRecommendations ? featuredPlaylists : playlists)?.filter((playlist) =>
        isPlaylistContainsText(playlist, searchedText)
      )
    : showRecommendations
      ? featuredPlaylists
      : playlists;

  const elRef = useRef<HTMLInputElement | null>(null);
  const { width, height } = useGetElSize(elRef);

  return (
    <div
      className={`playlists-list scroll-container d-flex flex-row flex-wrap align-items-center justify-content-center w-100 ${isMobile ? 'p-0' : ''} ${currentUriTrack ? 'playing' : ''}`}
    >
      <div className={`playlist invisible position-absolute`} ref={elRef} />

      {isLoadingPlaylists || isLoadingFeaturedPlaylists
        ? Array.from({ length: 20 }).map((_, index) => (
            <SkeletonLoader
              key={`playlist-skeleton-${index}`}
              width={width}
              height={height}
              borderRadius='4px'
              className={`p-1 ${isMobile ? 'm-2' : 'm-3'}`}
            />
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
