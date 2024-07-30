import { useSearchParams } from 'react-router-dom';
import { Track } from '../Track';
import { useRecommendationTracksQuery, useSearchTracksQuery } from 'src/api/tracks';
import { TrackType } from 'src/types/types';
import { Loader } from '../Loader';

type Props = {
  readyTracks?: TrackType[];
  isLine: boolean;
};

export const TracksList = ({ readyTracks, isLine }: Props): JSX.Element => {
  const [searchParams] = useSearchParams();

  const searchedText = searchParams.get('query') ?? '';

  const { data: tracks, isFetching: isFetchingTracks } = useSearchTracksQuery(searchedText, {
    enabled: !!searchedText,
  });

  const { data: recommendationsTracks, isFetching: isFetchingRecommendations } = useRecommendationTracksQuery({
    enabled: !searchedText,
    refetchInterval: 60000,
  });

  return (
    <div className={`content-container scroll-container ${isLine ? 'line' : ''}`}>
      {(isFetchingTracks || isFetchingRecommendations) && <Loader />}

      {(readyTracks ? readyTracks : searchedText ? tracks : recommendationsTracks)?.map((track, index) => (
        <Track track={track} key={`${track.name}-track-${index}-${track.uri}-${track.id}`} isLine={isLine} />
      ))}
    </div>
  );
};
