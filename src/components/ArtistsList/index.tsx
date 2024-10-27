import { Artist } from '../Artist';
import { ArtistType } from 'src/types/types';
import { SkeletonLoader } from '../SkeletonLoader';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';

type Props = {
  artists: ArtistType[];
  isLine: boolean;
  isLoading: boolean;
};

export const ArtistsList = ({ artists, isLine, isLoading }: Props): JSX.Element => {
  const { isMobile } = useContext(GlobalContext);

  return (
    <div className={`content-container scroll-container artist-list ${isLine ? 'line' : ''}`}>
      {isLoading
        ? Array.from({ length: 10 }).map((_, index) => (
            <SkeletonLoader
              key={`artist-skeleton-${index}`}
              className={`artist p-2 m-2 rounded-circle ${!isMobile && isLine ? 'mx-4' : ''} ${isLine ? 'line' : ''}`}
            />
          ))
        : artists?.map((artist, index) => (
            <Artist artist={artist} key={`${artist.name}-${index}-artist`} isLine={isLine} />
          ))}
    </div>
  );
};
