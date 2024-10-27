import { useSearchParams } from 'react-router-dom';
import { ThemeBtn } from 'src/components/ThemeBtn';
import { useAddPodcast, useDeletePodcast, usePodcastEpisodesQuery, usePodcastQuery } from 'src/api/podcasts';
import { EpisodesList } from '../EpisodesList';
import { SkeletonLoader } from 'src/components/SkeletonLoader';
import { Image } from 'react-bootstrap';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';

type Props = {
  podcastId: string;
  isSavedPodcast: boolean;
};

export const PodcastCatalog = ({ podcastId, isSavedPodcast }: Props): JSX.Element => {
  const { isLightTheme, isTablet, isMobile } = useContext(GlobalContext);
  const [, setSearchParams] = useSearchParams();

  const { data: podcast, isLoading: isLoadingPodcast } = usePodcastQuery(podcastId);

  const { data: episodes, isLoading: isLoadingEpisodes } = usePodcastEpisodesQuery(podcastId);

  const { mutateAsync: addPodcast } = useAddPodcast();
  const { mutateAsync: deletePodcast } = useDeletePodcast();

  return (
    <div className='podcast-catalog h-100'>
      <div className='header d-flex flex-row justify-content-between p-3 w-100 align-items-center'>
        <div
          className={`return-btn ${isMobile ? 'p-2' : 'p-3'} m-0 d-flex justify-content-between align-items-center text-white`}
          onClick={() => {
            setSearchParams((prev) => {
              prev.delete('podcast-id');
              return prev;
            });
          }}
        >
          <span className={`${isMobile ? 'fs-5' : 'fs-1'}`}>&lt;</span>
          Back
        </div>
        <ThemeBtn />
      </div>

      <div
        className={`podcast-info d-flex flex-row justify-content-start align-items-start w-100 ${isMobile ? 'p-0 px-2 text-center' : 'p-3'}`}
      >
        {isLoadingPodcast ? (
          <div
            className={`d-flex ${isMobile ? 'flex-column justify-content-center align-items-center' : 'flex-row'} w-100`}
          >
            <SkeletonLoader className='podcast-icon' />
            <div
              className={`d-flex flex-column w-100 ${isMobile ? 'm-0 justify-content-center align-items-center' : 'ms-3 h-100'}`}
            >
              <SkeletonLoader className={`podcast-name w-50 ${isMobile ? 'm-2' : 'mb-2'}`} />
              <SkeletonLoader className='podcast-description w-100' />
              <SkeletonLoader className='podcast-author w-25 mt-3' />
            </div>
          </div>
        ) : (
          <div
            className={`d-flex ${isMobile ? 'flex-column justify-content-center align-items-center' : 'flex-row'} w-100`}
          >
            <img
              className='podcast-icon object-fit-contain'
              src={podcast?.images.length ? podcast.images[0].url : '/src/image/not-found.jpg'}
            />
            <div
              className={`podcast-details d-flex flex-column ${isMobile ? 'm-0' : 'ms-3 h-100'} w-100 position-relative`}
            >
              <span className={`${isMobile ? 'fs-5' : isTablet ? 'fs-4' : 'fs-3'}`}>{podcast?.name}</span>
              <span className='description scroll-container mt-3'>{podcast?.description}</span>
              <span className={`${isTablet ? 'fs-6' : 'fs-5'} ${isMobile ? 'mt-2' : 'mt-4'}`}>
                Publisher: {podcast?.publisher}
              </span>
              {isSavedPodcast ? (
                <Image
                  className='icon object-fit-contain position-absolute'
                  src={isLightTheme ? '/src/images/trash-icon-light.png' : '/src/images/trash-icon.png'}
                  onClick={(e) => {
                    e.stopPropagation();

                    deletePodcast(podcast?.id ?? '');
                  }}
                />
              ) : (
                <Image
                  className='icon object-fit-contain position-absolute'
                  src={isLightTheme ? '/src/images/add-light-icon.png' : '/src/images/add-icon.png'}
                  onClick={(e) => {
                    e.stopPropagation();

                    addPodcast(podcastId);
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <EpisodesList episodes={episodes ?? []} isLoading={isLoadingEpisodes} />
    </div>
  );
};
