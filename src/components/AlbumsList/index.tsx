import { Album } from '../Album';
import { AlbumType } from 'src/types/types';
import { SkeletonLoader } from '../SkeletonLoader';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';

type Props = {
  albums: AlbumType[];
  isLine: boolean;
  isLoading: boolean;
};

export const AlbumsList = ({ albums, isLine, isLoading }: Props): JSX.Element => {
  const { isTablet } = useContext(GlobalContext);

  const skeletonWidthDesktop = isLine ? '210px' : '300px';
  const skeletonHeightDesktop = isLine ? '220px' : '350px';

  const skeletonWidthTablet = isLine ? '170px' : '240px';
  const skeletonHeightTablet = isLine ? '170px' : '250px';

  return (
    <div className={`content-container scroll-container albums-list ${isLine ? 'line' : ''}`}>
      {isLoading || !albums.length
        ? Array.from({ length: 10 }).map((_, index) => (
            <SkeletonLoader
              key={`album-skeleton-${index}`}
              width={isTablet ? skeletonWidthTablet : skeletonWidthDesktop}
              height={isTablet ? skeletonHeightTablet : skeletonHeightDesktop}
              borderRadius='0'
              className={`p-2 m-2 ${isLine ? 'mx-3' : ''}`}
            />
          ))
        : albums?.map((album, index) => (
            <Album album={album} key={`${album.name}-${album.release_date}-${index}-album`} isLine={isLine} />
          ))}
    </div>
  );
};
