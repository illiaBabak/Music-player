import { useSearchParams } from 'react-router-dom';
import { useReleasesAlbumsQuery, useSearchAlbumsQuery } from 'src/api/albums';
import { Album } from '../Album';

export const AlbumsList = (): JSX.Element => {
  const [searchParams] = useSearchParams();

  const searchedText = searchParams.get('query') ?? '';
  const selectedSection = searchParams.get('section');

  const { data: albums } = useSearchAlbumsQuery(searchedText, { enabled: !!searchedText });

  const { data: releasesAlbums } = useReleasesAlbumsQuery({ enabled: !searchedText });

  return (
    <div className={`content-container scroll-container albums-list ${selectedSection === 'All' ? 'line' : ''}`}>
      {(searchedText ? albums : releasesAlbums)?.map((album, index) => (
        <Album album={album} key={`${album.name}-${album.release_date}-${index}-album`} />
      ))}
    </div>
  );
};
