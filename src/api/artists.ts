import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ArtistType } from 'src/types/types';
import { isArtistResponse } from 'src/utils/guards';
import { ARTISTS_QUERY, BASE_URL } from './constants';
import { getHeaders } from '.';

const getArtists = async (searchedText: string): Promise<ArtistType[]> => {
  const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(searchedText)}&type=artist`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch artists from Spotify API');

  const responseJson: unknown = await response.json();

  return isArtistResponse(responseJson) ? responseJson.artists.items : [];
};

export const useSearchArtistQuery = (searchedText: string): UseQueryResult<ArtistType[], Error> =>
  useQuery({
    queryKey: [ARTISTS_QUERY, searchedText],
    queryFn: async () => {
      return await getArtists(searchedText);
    },
  });
