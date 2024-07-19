import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { AlbumType } from 'src/types/types';
import { isAlbumResponse } from 'src/utils/guards';
import { ALBUMS_QUERY, BASE_URL, REALEASES_QUERY } from './constants';
import { getHeaders } from '.';

const getAlbums = async (searchedText: string): Promise<AlbumType[]> => {
  const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(searchedText)}&type=album`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch albums from Spotify API');

  const responseJson: unknown = await response.json();

  return isAlbumResponse(responseJson) ? responseJson.albums.items : [];
};

const getReleasesAlbums = async (): Promise<AlbumType[]> => {
  const response = await fetch(`${BASE_URL}/browse/new-releases`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch releases albums from Spotify API');

  const responseJson: unknown = await response.json();

  return isAlbumResponse(responseJson) ? responseJson.albums.items : [];
};

export const useSearchAlbumsQuery = (
  searchedText: string,
  options?: Partial<UseQueryOptions<AlbumType[]>>
): UseQueryResult<AlbumType[], Error> =>
  useQuery({
    queryKey: [ALBUMS_QUERY, searchedText],
    queryFn: async () => {
      return await getAlbums(searchedText);
    },
    ...options,
  });

export const useReleasesAlbumsQuery = (
  options?: Partial<UseQueryOptions<AlbumType[]>>
): UseQueryResult<AlbumType[], Error> =>
  useQuery({ queryKey: [REALEASES_QUERY], queryFn: getReleasesAlbums, ...options });
