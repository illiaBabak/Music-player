import { useContext } from 'react';
import { SkeletonLoader } from '../SkeletonLoader';
import { Track } from '../Track';
import { TrackType } from 'src/types/types';
import { GlobalContext } from 'src/root';

type Props = {
  tracks: TrackType[];
  isLine: boolean;
  isLoading: boolean;
  isInPlaylist?: boolean;
  playlistId?: string;
  isOwnPlaylist?: boolean;
};

export const TracksList = ({
  tracks,
  isLine,
  isLoading,
  isInPlaylist,
  playlistId,
  isOwnPlaylist,
}: Props): JSX.Element => {
  const { isTablet } = useContext(GlobalContext);

  const skeletonWidthDesktop = isLine ? '300px' : '95%';
  const skeletonHeightDesktop = '85px';

  const skeletonWidthTablet = isLine ? '270px' : '95%';
  const skeletonHeightTablet = '75px';

  return (
    <div
      className={`content-container ${isInPlaylist ? '' : 'tracks'} scroll-container ${isLine ? 'line tracks-line' : ''}`}
    >
      {isLoading || !tracks.length
        ? Array.from({ length: 10 }).map((_, index) => (
            <SkeletonLoader
              key={`track-skeleton-${!!playlistId}-${index}`}
              width={isTablet ? skeletonWidthTablet : skeletonWidthDesktop}
              height={isTablet ? skeletonHeightTablet : skeletonHeightDesktop}
              borderRadius='4px'
              className='p-2 m-2'
            />
          ))
        : tracks.map((track, index) => (
            <Track
              track={track}
              key={`${track.name}-track-${index}-${track.uri}-${track.id}`}
              isLine={isLine}
              isInPlaylist={isInPlaylist}
              playlistId={playlistId}
              isOwnPlaylist={isOwnPlaylist}
              isFirst={isLine && (index === 0 || index === 1)}
            />
          ))}
    </div>
  );
};
