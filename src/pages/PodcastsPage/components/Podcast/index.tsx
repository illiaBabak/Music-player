import { useContext } from 'react';
import { Card, Image } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { useAddPodcast, useDeletePodcast } from 'src/api/podcasts';
import { GlobalContext } from 'src/root';
import { PodcastType } from 'src/types/types';

type Props = {
  podcast: PodcastType;
  isSavedPodcast: boolean;
};

export const Podcast = ({ podcast, isSavedPodcast }: Props): JSX.Element => {
  const [, setSearchParams] = useSearchParams();
  const { setCurrentUriTrack, isLightTheme, isTablet, isMobile } =
    useContext(GlobalContext);

  const { mutateAsync: addPodcast } = useAddPodcast();
  const { mutateAsync: deletePodcast } = useDeletePodcast();

  return (
    <Card
      onClick={() => {
        setSearchParams((prev) => {
          prev.set('podcast-id', podcast.id);
          return prev;
        });

        setCurrentUriTrack(podcast.uri);
      }}
      className={`d-flex flex-row justify-content-start align-items-center m-2 ${isMobile ? 'p-1' : 'p-2'} podcast text-white position-relative overflow-hidden`}
    >
      <Card.Img
        className='podcast-icon m-2 object-fit-contain'
        src={podcast.images.length ? podcast.images[0].url : '/not-found.jpg'}
      />

      <Card.Body
        className={`d-flex flex-column justify-content-start align-items-center w-100 h-100 ${isMobile ? 'p-1 ps-1 pe-3' : 'ms-1'}`}
      >
        <span
          className={`${isMobile ? 'text-fs' : isTablet ? 'fs-5' : 'fs-4'} text-center`}
        >
          {podcast.name}
        </span>
        <span
          className={`description mt-2 scroll-container ${isMobile ? 'p-2' : ''}`}
        >
          {podcast.description}
        </span>
        {isSavedPodcast ? (
          <Image
            className='icon object-fit-contain position-absolute'
            src={isLightTheme ? '/trash-icon-light.png' : '/trash-icon.png'}
            onClick={(e) => {
              e.stopPropagation();

              deletePodcast(podcast.id);
            }}
          />
        ) : (
          <Image
            className='icon object-fit-contain position-absolute'
            src={isLightTheme ? '/add-light-icon.png' : '/add-icon.png'}
            onClick={(e) => {
              e.stopPropagation();

              addPodcast(podcast.id);
            }}
          />
        )}
      </Card.Body>
    </Card>
  );
};
