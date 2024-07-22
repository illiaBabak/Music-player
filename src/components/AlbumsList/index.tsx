import { useSearchParams } from 'react-router-dom';
import { useReleasesAlbumsQuery, useSearchAlbumsQuery } from 'src/api/albums';
import { Album } from '../Album';
import { AlbumType } from 'src/types/types';

type Props = {
  readyAlbums?: AlbumType[];
};

export const AlbumsList = ({ readyAlbums }: Props): JSX.Element => {
  const [searchParams] = useSearchParams();

  const searchedText = searchParams.get('query') ?? '';
  const selectedSection = searchParams.get('section');

  const { data: albums } = useSearchAlbumsQuery(searchedText, { enabled: !!searchedText });

  const { data: releasesAlbums } = useReleasesAlbumsQuery({ enabled: !searchedText });

  const isLine = !!readyAlbums || selectedSection === 'All';

  return (
    <div className={`content-container scroll-container albums-list ${isLine ? 'line' : ''}`}>
      {(readyAlbums ? readyAlbums : searchedText ? albums : releasesAlbums)?.map((album, index) => (
        <Album album={album} key={`${album.name}-${album.release_date}-${index}-album`} isLine={isLine} />
      ))}
    </div>
  );
};
