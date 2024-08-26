import { Artist } from '../Artist';
import { ArtistType } from 'src/types/types';
import { SkeletonLoader } from '../SkeletonLoader';

type Props = {
  artists: ArtistType[];
  isLine: boolean;
  isLoading: boolean;
};

export const ArtistsList = ({ artists, isLine, isLoading }: Props): JSX.Element => (
  <div className={`content-container scroll-container artist-list ${isLine ? 'line' : ''}`}>
    {isLoading
      ? Array.from({ length: 10 }).map((_, index) => (
          <SkeletonLoader
            key={`artist-skeleton-${index}`}
            height={isLine ? '180px' : '300px'}
            width={isLine ? '180px' : '290px'}
            borderRadius='50%'
            className={`p-2 m-2 ${isLine ? 'mx-4' : ''}`}
          />
        ))
      : artists?.map((artist, index) => (
          <Artist artist={artist} key={`${artist.name}-${index}-artist`} isLine={isLine} />
        ))}
  </div>
);
