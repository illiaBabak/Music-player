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
  const { isMobile } = useContext(GlobalContext);

  return (
    <div className={`content-container scroll-container albums-list ${isLine ? 'line' : ''}`}>
      {isLoading || !albums.length
        ? Array.from({ length: 10 }).map((_, index) => (
            <SkeletonLoader
              key={`album-skeleton-${index}`}
              className={`album p-2 m-2 ${isLine ? `line ${isMobile ? 'mx-1' : 'mx-3'}` : ''}`}
            />
          ))
        : albums?.map((album, index) => (
            <Album album={album} key={`${album.name}-${album.release_date}-${index}-album`} isLine={isLine} />
          ))}
    </div>
  );
};
