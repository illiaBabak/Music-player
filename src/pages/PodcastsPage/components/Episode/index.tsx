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
  const { isTablet, isMobile } = useContext(GlobalContext);

  return (
    <Card className='d-flex flex-row justify-content-start align-items-center m-2 p-2 episode'>
      <div className={`d-flex ${isMobile ? 'flex-column' : ''}`}>
        <Card.Img
          className='episode-icon object-fit-contain'
          src={episode.images.length ? episode.images[0].url : '/not-found.jpg'}
        />

        {isMobile && (
          <div className='d-flex flex-row justify-content-center align-items-center m-0'>
            <span className='detail'>{msToMinSec(episode.duration_ms)},</span>
            <span className='detail ms-1'>
              {formatDate(episode.release_date)}
            </span>
          </div>
        )}
      </div>

      <Card.Body
        className={`d-flex flex-column justify-content-start align-items-start episode-body h-100 position-relative ${isMobile ? 'p-0 ms-3' : ''}`}
      >
        <span
          className={`${isMobile ? 'small-text' : isTablet ? 'fs-6' : 'fs-5'}`}
        >
          {episode.name}
        </span>
        <span
          className={`${isMobile ? 'small-text' : ''} detail description scroll-container mt-2`}
        >
          {episode.description}
        </span>
        {!isMobile && (
          <div className='d-flex flex-row justify-content-center align-items-center mt-4'>
            <span className='detail'>{msToMinSec(episode.duration_ms)},</span>
            <span className='detail ms-1'>
              {formatDate(episode.release_date)}
            </span>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
