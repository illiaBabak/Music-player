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
  const { isMobile } = useContext(GlobalContext);

  return (
    <div
      className={`content-container ${isInPlaylist ? 'playlist-tracks' : 'tracks'} scroll-container ${isLine ? 'line tracks-line' : ''}`}
    >
      {isLoading || !tracks.length
        ? Array.from({ length: 10 }).map((_, index) => (
            <SkeletonLoader
              key={`track-skeleton-${!!playlistId}-${index}`}
              className={`track ${isMobile ? 'm-1 p-1' : 'm-2 p-2'} ${isLine && (index === 0 || index === 1) && !isMobile ? 'me-4 px-3' : 'mx-2 px-3'} ${isLine ? 'line' : ''}`}
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
