import { Album } from '../Album';
import { AlbumType } from 'src/types/types';
import { SkeletonLoader } from '../SkeletonLoader';
import { useContext, useRef } from 'react';
import { GlobalContext } from 'src/root';
import { useGetElSize } from 'src/hooks/useGetElSize';

type Props = {
  albums: AlbumType[];
  isLine: boolean;
  isLoading: boolean;
};

export const AlbumsList = ({ albums, isLine, isLoading }: Props): JSX.Element => {
  const { isMobile } = useContext(GlobalContext);

  const elRef = useRef<HTMLInputElement | null>(null);
  const { width, height } = useGetElSize(elRef);

  return (
    <div className={`content-container scroll-container albums-list ${isLine ? 'line' : ''}`}>
      <div className={`album p-2 m-2 invisible position-absolute ${isLine ? 'line' : ''}`} ref={elRef} />

      {isLoading || !albums.length
        ? Array.from({ length: 10 }).map((_, index) => (
            <SkeletonLoader
              key={`album-skeleton-${index}`}
              width={width}
              height={height}
              borderRadius='0'
              className={`p-2 m-2 ${isLine ? `${isMobile ? 'mx-1' : 'mx-3'}` : ''}`}
            />
          ))
        : albums?.map((album, index) => (
            <Album album={album} key={`${album.name}-${album.release_date}-${index}-album`} isLine={isLine} />
          ))}
    </div>
  );
};
