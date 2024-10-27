import { EpisodeType } from 'src/types/types';
import { Episode } from '../Episode';
import { SkeletonLoader } from 'src/components/SkeletonLoader';

type Props = {
  episodes: EpisodeType[];
  isLoading: boolean;
};

export const EpisodesList = ({ episodes, isLoading }: Props): JSX.Element => (
  <div className='content-container episodes scroll-container'>
    {isLoading
      ? Array.from({ length: 5 }).map((_, index) => (
          <SkeletonLoader key={`episode-skeleton-${index}`} className='m-2 p-2 episode' />
        ))
      : episodes.map((episode, index) => <Episode episode={episode} key={`episode-${index}-${episode.uri}`} />)}
  </div>
);
