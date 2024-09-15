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
  const { isTablet } = useContext(GlobalContext);

  const skeletonWidthDesktop = isLine ? '180px' : '300px';
  const skeletonHeightDesktop = isLine ? '180px' : '290px';

  const skeletonWidthTablet = isLine ? '150px' : '230px';
  const skeletonHeightTablet = isLine ? '150px' : '240px';

  return (
    <div className={`content-container scroll-container artist-list ${isLine ? 'line' : ''}`}>
      {isLoading
        ? Array.from({ length: 10 }).map((_, index) => (
            <SkeletonLoader
              key={`artist-skeleton-${index}`}
              height={isTablet ? skeletonHeightTablet : skeletonHeightDesktop}
              width={isTablet ? skeletonWidthTablet : skeletonWidthDesktop}
              borderRadius='50%'
              className={`p-2 m-2 ${isLine ? 'mx-4' : ''}`}
            />
          ))
        : artists?.map((artist, index) => (
            <Artist artist={artist} key={`${artist.name}-${index}-artist`} isLine={isLine} />
          ))}
    </div>
  );
};
