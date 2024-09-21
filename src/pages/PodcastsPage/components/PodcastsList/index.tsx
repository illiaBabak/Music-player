import { PodcastType } from 'src/types/types';
import { Podcast } from '../Podcast';
import { SkeletonLoader } from 'src/components/SkeletonLoader';
import { useContext, useRef } from 'react';
import { GlobalContext } from 'src/root';
import { useGetElSize } from 'src/hooks/useGetElSize';

type Props = {
  podcasts: PodcastType[];
  isLoading: boolean;
  isOwnPodcasts: boolean;
  searchedText: string;
  userPodcasts: PodcastType[];
};

const isPodcastContainsText = (podcast: PodcastType, text: string) =>
  podcast.name.toLocaleLowerCase().includes(text.toLocaleLowerCase());

export const PodcastsList = ({
  podcasts,
  isLoading,
  isOwnPodcasts,
  searchedText,
  userPodcasts,
}: Props): JSX.Element => {
  const { isMobile } = useContext(GlobalContext);

  const filteredPodcasts = isOwnPodcasts
    ? podcasts.filter((podcast) => isPodcastContainsText(podcast, searchedText))
    : podcasts;

  const elRef = useRef<HTMLInputElement | null>(null);
  const { width, height } = useGetElSize(elRef);

  return (
    <div className='content-container podcasts scroll-container'>
      <div className={`m-2 ${isMobile ? 'p-1' : 'p-2'} podcast position-absolute invisible`} ref={elRef} />

      {isLoading
        ? Array.from({ length: 8 }).map((_, index) => (
            <SkeletonLoader
              key={`podcast-skeleton-${index}`}
              width={width}
              height={height}
              borderRadius='4px'
              className={`m-2 ${isMobile ? 'p-1' : 'p-2'}`}
            />
          ))
        : filteredPodcasts.map((podcast, index) => (
            <Podcast
              isSavedPodcast={userPodcasts?.some((userPodcast) => userPodcast.id === podcast.id)}
              key={`${podcast.id}-${index}`}
              podcast={podcast}
            />
          ))}
    </div>
  );
};
