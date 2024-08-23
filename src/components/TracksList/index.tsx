import { SkeletonLoader } from '../SkeletonLoader';
import { Track } from '../Track';
import { TrackType } from 'src/types/types';

type Props = {
  tracks: TrackType[];
  isLine: boolean;
  isLoading: boolean;
  isTracksInPlaylist?: boolean;
  playlistId?: string;
};

export const TracksList = ({ tracks, isLine, isLoading, isTracksInPlaylist, playlistId }: Props): JSX.Element => (
  <div className={`content-container scroll-container ${isLine ? 'line tracks-line' : ''}`}>
    {isLoading || !tracks.length
      ? Array.from({ length: 10 }).map((_, index) => (
          <SkeletonLoader
            key={`track-skeleton-${!!playlistId}-${index}`}
            width={isLine ? '300px' : '98%'}
            height='85px'
            borderRadius='4px'
            optionalClasses={['p-2', 'm-2']}
          />
        ))
      : tracks.map((track, index) => (
          <Track
            track={track}
            key={`${track.name}-track-${index}-${track.uri}-${track.id}`}
            isLine={isLine}
            isTracksInPlaylist={isTracksInPlaylist}
            playlistId={playlistId}
          />
        ))}
  </div>
);
