import { Artist } from '../Artist';
import { ArtistType } from 'src/types/types';
import { Loader } from '../Loader';

type Props = {
  artists: ArtistType[];
  isLine: boolean;
  isLoading: boolean;
};

export const ArtistsList = ({ artists, isLine, isLoading }: Props): JSX.Element => (
  <div className={`content-container scroll-container artist-list ${isLine ? 'line' : ''}`}>
    {isLoading && <Loader />}

    {artists?.map((artist, index) => <Artist artist={artist} key={`${artist.name}-${index}-artist`} isLine={isLine} />)}
  </div>
);
