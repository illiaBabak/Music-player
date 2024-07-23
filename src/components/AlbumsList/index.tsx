import { useSearchParams } from 'react-router-dom';
import { useReleasesAlbumsQuery, useSearchAlbumsQuery } from 'src/api/albums';
import { Album } from '../Album';
import { AlbumType } from 'src/types/types';
import { Loader } from '../Loader';

type Props = {
  readyAlbums?: AlbumType[];
};

export const AlbumsList = ({ readyAlbums }: Props): JSX.Element => {
  const [searchParams] = useSearchParams();

  const searchedText = searchParams.get('query') ?? '';
  const selectedSection = searchParams.get('section');

  const { data: albums, isFetching: isFetchingAlbums } = useSearchAlbumsQuery(searchedText, {
    enabled: !!searchedText,
  });

  const { data: releasesAlbums, isFetching: isFetchingReleases } = useReleasesAlbumsQuery({ enabled: !searchedText });

  const isLine = !!readyAlbums || selectedSection === 'All';

  return (
    <div className={`content-container scroll-container albums-list ${isLine ? 'line' : ''}`}>
      {(isFetchingAlbums || isFetchingReleases) && <Loader />}

      {(readyAlbums ? readyAlbums : searchedText ? albums : releasesAlbums)?.map((album, index) => (
        <Album album={album} key={`${album.name}-${album.release_date}-${index}-album`} isLine={isLine} />
      ))}
    </div>
  );
};
