import { useFeaturedPlaylistsQuery, usePlaylistsQuery } from 'src/api/playlists';
import { PlayList } from '../PlayList';
import { useSearchParams } from 'react-router-dom';
import { PlaylistType } from 'src/types/types';
import { useContext, useEffect } from 'react';
import { GlobalContext } from 'src/root';
import { SkeletonLoader } from '../SkeletonLoader';

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
  const { disabledPlaylists, isTablet } = useContext(GlobalContext);
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

  const skeletonWidthDesktop = '220px';
  const skeletonHeightDesktop = '240px';

  const skeletonWidthTablet = '190px';
  const skeletonHeightTablet = '220px';

  return (
    <div className='playlists-list scroll-container d-flex flex-row flex-wrap align-items-center justify-content-center w-100'>
      {isLoadingPlaylists || isLoadingFeaturedPlaylists
        ? Array.from({ length: 20 }).map((_, index) => (
            <SkeletonLoader
              key={`playlist-skeleton-${index}`}
              width={isTablet ? skeletonWidthTablet : skeletonWidthDesktop}
              height={isTablet ? skeletonHeightTablet : skeletonHeightDesktop}
              borderRadius='4px'
              className='p-1 m-3'
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
    </div>
  );
};
