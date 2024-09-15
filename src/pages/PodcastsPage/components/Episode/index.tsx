import { useContext } from 'react';
import { Card } from 'react-bootstrap';
import { GlobalContext } from 'src/root';
import { EpisodeType } from 'src/types/types';
import { formatDate } from 'src/utils/formatDate';
import { msToMinSec } from 'src/utils/msToMinSec';

type Props = {
  episode: EpisodeType;
};

export const Episode = ({ episode }: Props): JSX.Element => {
  const { isTablet } = useContext(GlobalContext);

  return (
    <Card className='d-flex flex-row justify-content-start align-items-center m-2 p-2 episode'>
      <Card.Img
        className='episode-icon ms-3 object-fit-contain'
        src={episode.images.length ? episode.images[0].url : '/src/images/not-found.jpg'}
      />
      <Card.Body className='d-flex flex-column justify-content-start align-items-start episode-body h-100 position-relative'>
        <span className={`${isTablet ? 'fs-6' : 'fs-5'}`}>{episode.name}</span>
        <span className='detail description scroll-container mt-2'>{episode.description}</span>

        <div className='d-flex flex-row justify-content-center align-items-center mt-4'>
          <span className='detail'>{msToMinSec(episode.duration_ms)},</span>
          <span className='detail ms-1'>{formatDate(episode.release_date)}</span>
        </div>
      </Card.Body>
    </Card>
  );
};
