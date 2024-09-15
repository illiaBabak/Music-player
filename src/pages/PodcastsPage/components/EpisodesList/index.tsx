import { EpisodeType } from 'src/types/types';
import { Episode } from '../Episode';
import { SkeletonLoader } from 'src/components/SkeletonLoader';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';

type Props = {
  episodes: EpisodeType[];
  isLoading: boolean;
};

export const EpisodesList = ({ episodes, isLoading }: Props): JSX.Element => {
  const { isTablet } = useContext(GlobalContext);

  const skeletonWidth = '95%';

  const skeletonHeightDesktop = '180px';

  const skeletonHeightTablet = '160px';

  return (
    <div className='content-container episodes scroll-container'>
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => (
            <SkeletonLoader
              key={`episode-skeleton-${index}`}
              width={skeletonWidth}
              height={isTablet ? skeletonHeightTablet : skeletonHeightDesktop}
              borderRadius='4px'
              className='m-2 p-2'
            />
          ))
        : episodes.map((episode, index) => <Episode episode={episode} key={`episode-${index}-${episode.uri}`} />)}
    </div>
  );
};
