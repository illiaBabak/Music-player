import { PodcastType } from 'src/types/types';
import { Podcast } from '../Podcast';
import { SkeletonLoader } from 'src/components/SkeletonLoader';

type Props = {
  podcasts: PodcastType[];
  isLoading: boolean;
};

export const PodcastsList = ({ podcasts, isLoading }: Props): JSX.Element => (
  <div className='content-container podcasts scroll-container'>
    {isLoading
      ? Array.from({ length: 8 }).map((_, index) => (
          <SkeletonLoader
            key={`podcast-skeleton-${index}`}
            width='98%'
            height='220px'
            borderRadius='4px'
            optionalClasses={['m-2', 'p-2']}
          />
        ))
      : podcasts.map((podcast, index) => <Podcast key={`${podcast.id}-${index}`} podcast={podcast} />)}
  </div>
);
