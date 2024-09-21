import { EpisodeType } from 'src/types/types';
import { Episode } from '../Episode';
import { SkeletonLoader } from 'src/components/SkeletonLoader';
import { useRef } from 'react';
import { useGetElSize } from 'src/hooks/useGetElSize';

type Props = {
  episodes: EpisodeType[];
  isLoading: boolean;
};

export const EpisodesList = ({ episodes, isLoading }: Props): JSX.Element => {
  const elRef = useRef<HTMLInputElement | null>(null);
  const { width, height } = useGetElSize(elRef);

  return (
    <div className='content-container episodes scroll-container'>
      <div className='episode position-absolute invisible' ref={elRef} />

      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => (
            <SkeletonLoader
              key={`episode-skeleton-${index}`}
              width={width}
              height={height}
              borderRadius='4px'
              className='m-2 p-2'
            />
          ))
        : episodes.map((episode, index) => <Episode episode={episode} key={`episode-${index}-${episode.uri}`} />)}
    </div>
  );
};
