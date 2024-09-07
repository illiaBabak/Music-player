import { SkeletonLoader } from '../SkeletonLoader';
import { Track } from '../Track';
import { TrackType } from 'src/types/types';

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
}: Props): JSX.Element => (
  <div className={`content-container scroll-container ${isLine ? 'line tracks-line' : ''}`}>
    {isLoading || !tracks.length
      ? Array.from({ length: 10 }).map((_, index) => (
          <SkeletonLoader
            key={`track-skeleton-${!!playlistId}-${index}`}
            width={isLine ? '300px' : '95%'}
            height='85px'
            borderRadius='4px'
            className='p-3 m-3 ms-3'
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
          />
        ))}
  </div>
);
