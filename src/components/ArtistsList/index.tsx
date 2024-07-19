import { useSearchParams } from 'react-router-dom';
import { useSearchArtistQuery } from 'src/api/artists';
import { Artist } from '../Artist';

export const ArtistsList = (): JSX.Element => {
  const [searchParams] = useSearchParams();

  const searchedText = searchParams.get('query') ?? '';
  const selectedSection = searchParams.get('section');

  const { data: artists } = useSearchArtistQuery(searchedText);

  return (
    <div className={`content-container scroll-container artist-list ${selectedSection === 'All' ? 'line' : ''}`}>
      {artists?.map((artist, index) => <Artist artist={artist} key={`${artist.name}-${index}-artist`} />)}
    </div>
  );
};
