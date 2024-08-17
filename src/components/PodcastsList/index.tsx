import { PodcastType } from 'src/types/types';
import { Loader } from '../Loader';
import { Podcast } from '../Podcast';

type Props = {
  podcasts: PodcastType[];
  isLoading: boolean;
};

export const PodcastsList = ({ podcasts, isLoading }: Props): JSX.Element => (
  <div className='content-container podcasts scroll-container'>
    {isLoading ? (
      <Loader />
    ) : (
      podcasts.map((podcast, index) => <Podcast key={`${podcast.id}-${index}`} podcast={podcast} />)
    )}
  </div>
);
