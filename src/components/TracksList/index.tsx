import { useSearchParams } from 'react-router-dom';
import { Track } from '../Track';
import { useRecommendationTracksQuery, useSearchTracksQuery } from 'src/api/tracks';
import { TrackType } from 'src/types/types';
import { Loader } from '../Loader';

type Props = {
  readyTracks?: TrackType[];
};

export const TracksList = ({ readyTracks }: Props): JSX.Element => {
  const [searchParams] = useSearchParams();

  const searchedText = searchParams.get('query') ?? '';
  const selectedSection = searchParams.get('section');

  const { data: tracks, isFetching: isFetchingTracks } = useSearchTracksQuery(searchedText, {
    enabled: !!searchedText,
  });

  const { data: recommendationsTracks, isFetching: isFetchingRecommendations } = useRecommendationTracksQuery({
    enabled: !searchedText,
    refetchInterval: 60000,
  });

  const isLine = !!readyTracks || selectedSection === 'All';

  return (
    <div className={`content-container scroll-container ${isLine ? 'line' : ''}`}>
      {(isFetchingTracks || isFetchingRecommendations) && <Loader />}

      {(readyTracks ? readyTracks : searchedText ? tracks : recommendationsTracks)?.map((track, index) => (
        <Track track={track} key={`${track.name}-track-${index}`} isLine={isLine} />
      ))}
    </div>
  );
};
