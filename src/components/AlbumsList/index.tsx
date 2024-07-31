import { Album } from '../Album';
import { AlbumType } from 'src/types/types';
import { Loader } from '../Loader';

type Props = {
  albums: AlbumType[];
  isLine: boolean;
  isLoading: boolean;
};

export const AlbumsList = ({ albums, isLine, isLoading }: Props): JSX.Element => (
  <div className={`content-container scroll-container albums-list ${isLine ? 'line' : ''}`}>
    {isLoading && <Loader />}

    {albums?.map((album, index) => (
      <Album album={album} key={`${album.name}-${album.release_date}-${index}-album`} isLine={isLine} />
    ))}
  </div>
);
