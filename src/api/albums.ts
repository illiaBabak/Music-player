import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { AlbumType } from 'src/types/types';
import { isAlbum, isAlbumResponse } from 'src/utils/guards';
import { ALBUM_QUERY, ALBUMS_QUERY, BASE_URL, REALEASES_QUERY } from './constants';
import { fetchWithRedirects } from '.';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';

const getAlbums = async (searchedText: string): Promise<AlbumType[]> => {
  const result = await fetchWithRedirects(`${BASE_URL}/search?q=${encodeURIComponent(searchedText)}&type=album`, 'GET');

  if (!result) throw new Error('Failed to fetch albums from Spotify API');

  return isAlbumResponse(result) ? result.albums.items : [];
};

const getReleasesAlbums = async (): Promise<AlbumType[]> => {
  const result = await fetchWithRedirects(`${BASE_URL}/browse/new-releases`, 'GET');

  if (!result) throw new Error('Failed to fetch releases albums from Spotify API');

  return isAlbumResponse(result) ? result.albums.items : [];
};

const getAlbum = async (id: string): Promise<AlbumType | null> => {
  const result = await fetchWithRedirects(`${BASE_URL}/albums/${id}`, 'GET');

  if (!result) throw new Error('Failed to fetch album from Spotify API');

  return isAlbum(result) ? result : null;
};

export const useSearchAlbumsQuery = (
  searchedText: string,
  options?: Partial<UseQueryOptions<AlbumType[]>>
): UseQueryResult<AlbumType[], Error> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [ALBUMS_QUERY, searchedText],
    queryFn: async () => {
      try {
        return await getAlbums(searchedText);
      } catch {
        setAlertProps({ type: 'error', position: 'top', text: 'Something went wrong with albums search :(' });
        return [];
      }
    },
    ...options,
  });
};

export const useReleasesAlbumsQuery = (
  options?: Partial<UseQueryOptions<AlbumType[]>>
): UseQueryResult<AlbumType[], Error> => {
  const { setAlertProps } = useContext(GlobalContext);
  return useQuery({
    queryKey: [REALEASES_QUERY],
    queryFn: async () => {
      try {
        return await getReleasesAlbums();
      } catch {
        setAlertProps({ type: 'error', position: 'top', text: 'Something went wrong with releases albums :(' });
        return [];
      }
    },
    ...options,
  });
};

export const useAlbumQuery = (id: string): UseQueryResult<AlbumType | null, Error> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [ALBUM_QUERY, id],
    queryFn: async () => {
      try {
        return await getAlbum(id);
      } catch {
        setAlertProps({ position: 'top', type: 'error', text: 'Something went wrong with album :(' });
        return null;
      }
    },
  });
};
