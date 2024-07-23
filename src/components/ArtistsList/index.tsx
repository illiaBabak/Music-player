import { useSearchParams } from 'react-router-dom';
import { useSearchArtistQuery } from 'src/api/artists';
import { Artist } from '../Artist';
import { ArtistType } from 'src/types/types';
import { Loader } from '../Loader';

type Props = {
  readyArtists?: ArtistType[];
};

export const ArtistsList = ({ readyArtists }: Props): JSX.Element => {
  const [searchParams] = useSearchParams();

  const searchedText = searchParams.get('query') ?? '';
  const selectedSection = searchParams.get('section');

  const { data: artists, isFetching } = useSearchArtistQuery(searchedText, { enabled: !readyArtists });

  const isLine = !!readyArtists || selectedSection === 'All';

  return (
    <div className={`content-container scroll-container artist-list ${isLine ? 'line' : ''}`}>
      {isFetching && <Loader />}

      {(readyArtists ? readyArtists : artists)?.map((artist, index) => (
        <Artist artist={artist} key={`${artist.name}-${index}-artist`} isLine={isLine} />
      ))}
    </div>
  );
};
