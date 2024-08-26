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
  const { setCurrentUriTrack, isLightTheme } = useContext(GlobalContext);

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
      className='d-flex flex-row justify-content-start align-items-center m-2 p-2 podcast text-white'
    >
      <Card.Img
        className='podcast-icon m-2'
        src={podcast.images.length ? podcast.images[0].url : '/src/images/not-found.jpg'}
      />

      <Card.Body className='d-flex flex-column justify-content-start align-items-center ms-1 w-100 h-100'>
        <span className='fs-4'>{podcast.name}</span>
        <span className='description mt-2 scroll-container'>{podcast.description}</span>
        {isSavedPodcast ? (
          <Image
            className='delete-icon'
            src={isLightTheme ? '/src/images/trash-icon-light.png' : '/src/images/trash-icon.png'}
            onClick={(e) => {
              e.stopPropagation();

              deletePodcast(podcast.id);
            }}
          />
        ) : (
          <Image
            className='add-icon'
            src={isLightTheme ? '/src/images/add-light-icon.png' : '/src/images/add-icon.png'}
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
