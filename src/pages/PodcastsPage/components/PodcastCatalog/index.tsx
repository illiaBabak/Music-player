import { useSearchParams } from 'react-router-dom';
import { ThemeBtn } from 'src/components/ThemeBtn';
import { usePodcastEpisodesQuery, usePodcastQuery } from 'src/api/podcasts';
import { EpisodesList } from '../EpisodesList';
import { SkeletonLoader } from 'src/components/SkeletonLoader';

type Props = {
  podcastId: string;
};

export const PodcastCatalog = ({ podcastId }: Props): JSX.Element => {
  const [, setSearchParams] = useSearchParams();

  const { data: podcast, isFetching: isLoadingPodcast } = usePodcastQuery(podcastId);

  const { data: episodes, isFetching: isLoadingEpisodes } = usePodcastEpisodesQuery(podcastId);

  return (
    <div className='podcast-catalog h-100'>
      <div className='header d-flex flex-row justify-content-between p-3 w-100 align-items-center'>
        <div
          className='return-btn p-3 m-0 d-flex justify-content-between align-items-center text-white'
          onClick={() => {
            setSearchParams((prev) => {
              prev.delete('podcast-id');
              return prev;
            });
          }}
        >
          <span className='fs-1'>&lt;</span>
          Back
        </div>
        <ThemeBtn />
      </div>

      <div className='podcast-info d-flex flex-row justify-content-start align-items-start w-100 p-3'>
        {isLoadingPodcast ? (
          <>
            <SkeletonLoader width='220px' height='220px' borderRadius='0' />
            <div className='ms-3 d-flex flex-column w-100 h-100'>
              <SkeletonLoader width='50%' height='42px' borderRadius='0' optionalClasses={['mb-2']} />
              <SkeletonLoader width='100%' height='120px' borderRadius='0' />
              <SkeletonLoader width='25%' height='32px' borderRadius='0' optionalClasses={['mt-3']} />
            </div>
          </>
        ) : (
          <>
            <img
              className='podcast-icon'
              src={podcast?.images.length ? podcast.images[0].url : '/src/image/not-found.jpg'}
            />
            <div className='podcast-details d-flex flex-column w-100 ms-3 h-100'>
              <span className='fs-3'>{podcast?.name}</span>
              <span className='description scroll-container mt-3'>{podcast?.description}</span>
              <span className='fs-5 mt-4'>Publisher: {podcast?.publisher}</span>
            </div>
          </>
        )}
      </div>

      <EpisodesList episodes={episodes ?? []} isLoading={isLoadingEpisodes} />
    </div>
  );
};
