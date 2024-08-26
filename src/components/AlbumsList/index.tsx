import { Album } from '../Album';
import { AlbumType } from 'src/types/types';
import { SkeletonLoader } from '../SkeletonLoader';

type Props = {
  albums: AlbumType[];
  isLine: boolean;
  isLoading: boolean;
};

export const AlbumsList = ({ albums, isLine, isLoading }: Props): JSX.Element => (
  <div className={`content-container scroll-container albums-list ${isLine ? 'line' : ''}`}>
    {isLoading || !albums.length
      ? Array.from({ length: 10 }).map((_, index) => (
          <SkeletonLoader
            key={`album-skeleton-${index}`}
            width={isLine ? '210px' : '300px'}
            height={isLine ? '220px' : '350px'}
            borderRadius='0'
            optionalClasses={['p-2', 'm-2', isLine ? 'mx-3' : '']}
          />
        ))
      : albums?.map((album, index) => (
          <Album album={album} key={`${album.name}-${album.release_date}-${index}-album`} isLine={isLine} />
        ))}
  </div>
);
