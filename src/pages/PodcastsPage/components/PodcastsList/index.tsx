import { PodcastType } from 'src/types/types';
import { Podcast } from '../Podcast';
import { SkeletonLoader } from 'src/components/SkeletonLoader';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';

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

  return (
    <div className='content-container podcasts scroll-container'>
      {isLoading
        ? Array.from({ length: 8 }).map((_, index) => (
            <SkeletonLoader key={`podcast-skeleton-${index}`} className={`m-2 ${isMobile ? 'p-1' : 'p-2'} podcast`} />
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
