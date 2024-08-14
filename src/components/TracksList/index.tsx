import { Track } from '../Track';
import { TrackType } from 'src/types/types';
import { Loader } from '../Loader';

type Props = {
  tracks: TrackType[];
  isLine: boolean;
  isLoading: boolean;
  isTracksInPlaylist?: boolean;
  playlistId?: string;
};

export const TracksList = ({ tracks, isLine, isLoading, isTracksInPlaylist, playlistId }: Props): JSX.Element => (
  <div className={`content-container scroll-container ${isLine ? 'line tracks-line' : ''}`}>
    {isLoading ? (
      <Loader />
    ) : (
      tracks.map((track, index) => (
        <Track
          track={track}
          key={`${track.name}-track-${index}-${track.uri}-${track.id}`}
          isLine={isLine}
          isTracksInPlaylist={isTracksInPlaylist}
          playlistId={playlistId}
        />
      ))
    )}
  </div>
);
