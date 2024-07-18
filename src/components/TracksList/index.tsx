import { useSearchParams } from 'react-router-dom';
import { Track } from '../Track';
import { useSearchTracksQuery } from 'src/api/tracks';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';
import { TrackType } from 'src/types/types';

type Props = {
  readyTracks?: TrackType[];
};

export const TracksList = ({ readyTracks }: Props): JSX.Element => {
  const { selectedChip } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();

  const searchedText = searchParams.get('query') ?? '';

  const { data: tracks } = useSearchTracksQuery(searchedText);

  const isLine = !readyTracks && selectedChip === 'All';

  return (
    <div className={`content-container scroll-container ${isLine ? 'line' : ''}`}>
      {(readyTracks ? readyTracks : tracks)?.map((track, index) => (
        <Track track={track} key={`${track.name}-track-${index}`} isLine={isLine} />
      ))}
    </div>
  );
};
