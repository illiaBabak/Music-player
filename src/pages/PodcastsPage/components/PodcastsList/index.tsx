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
  const { isTablet } = useContext(GlobalContext);

  const filteredPodcasts = isOwnPodcasts
    ? podcasts.filter((podcast) => isPodcastContainsText(podcast, searchedText))
    : podcasts;

  const skeletonWidth = '95%';

  const skeletonHeightDesktop = '270px';

  const skeletonHeightTablet = '180px';

  return (
    <div className='content-container podcasts scroll-container'>
      {isLoading
        ? Array.from({ length: 8 }).map((_, index) => (
            <SkeletonLoader
              key={`podcast-skeleton-${index}`}
              width={skeletonWidth}
              height={isTablet ? skeletonHeightTablet : skeletonHeightDesktop}
              borderRadius='4px'
              className='m-2 p-2'
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
