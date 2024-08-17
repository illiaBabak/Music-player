import { EpisodeType } from 'src/types/types';
import { Loader } from '../Loader';
import { Episode } from '../Episode';

type Props = {
  episodes: EpisodeType[];
  isLoading: boolean;
};

export const EpisodesList = ({ episodes, isLoading }: Props): JSX.Element => (
  <div className='content-container episodes scroll-container'>
    {isLoading ? (
      <Loader />
    ) : (
      episodes.map((episode, index) => <Episode episode={episode} key={`episode-${index}-${episode.uri}`} />)
    )}
  </div>
);
