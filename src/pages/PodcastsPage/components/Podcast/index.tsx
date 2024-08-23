import { useContext } from 'react';
import { Card } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { GlobalContext } from 'src/root';
import { PodcastType } from 'src/types/types';

type Props = {
  podcast: PodcastType;
};

export const Podcast = ({ podcast }: Props): JSX.Element => {
  const [, setSearchParams] = useSearchParams();
  const { setCurrentUriTrack } = useContext(GlobalContext);

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
      </Card.Body>
    </Card>
  );
};
