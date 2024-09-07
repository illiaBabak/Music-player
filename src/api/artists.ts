import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { AlbumType, ArtistType } from 'src/types/types';
import { isAlbumResponseObj, isArtist, isArtistsResponse, isArtistsResponseObj, isTopArtists } from 'src/utils/guards';
import {
  ARTIST_ALBUMS_QUERY,
  ARTIST_QUERY,
  ARTISTS_QUERY,
  BASE_URL,
  RELATED_ARTISTS_QUERY,
  TOP_USER_ARTISTS_QUERY,
} from './constants';
import { fetchWithRedirects } from '.';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';

const getArtists = async (searchedText: string): Promise<ArtistType[]> => {
  const result = await fetchWithRedirects(
    `${BASE_URL}/search?q=${encodeURIComponent(searchedText)}&type=artist`,
    'GET'
  );

  if (!result) throw new Error('Failed to fetch artists from Spotify API');

  return isArtistsResponse(result) ? result.artists.items : [];
};

const getArtist = async (id: string): Promise<ArtistType | null> => {
  const result = await fetchWithRedirects(`${BASE_URL}/artists/${id}`, 'GET');

  if (!result) throw new Error('Failed to fetch artist from Spotify API');

  return isArtist(result) ? result : null;
};

const getRelatedArtists = async (id: string): Promise<ArtistType[]> => {
  const result = await fetchWithRedirects(`${BASE_URL}/artists/${id}/related-artists`, 'GET');

  if (!result) throw new Error('Failed to fetch related artists from Spotify API');

  return isArtistsResponseObj(result) ? result.artists : [];
};

const getArtistAlbums = async (id: string): Promise<AlbumType[]> => {
  const result = await fetchWithRedirects(`${BASE_URL}/artists/${id}/albums`, 'GET');

  if (!result) throw new Error('Failed to fetch artist albums from Spotify API');

  return isAlbumResponseObj(result) ? result.items : [];
};

const getTopUserArtists = async (): Promise<ArtistType[]> => {
  const result = await fetchWithRedirects(`${BASE_URL}/me/top/artists`, 'GET');

  if (!result) throw new Error('Failed to fetch top user artists from Spotify API');

  return isTopArtists(result) ? result.items : [];
};

export const useSearchArtistQuery = (
  searchedText: string,
  options?: Partial<UseQueryOptions<ArtistType[]>>
): UseQueryResult<ArtistType[], Error> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [ARTISTS_QUERY, searchedText],
    queryFn: async () => {
      try {
        return await getArtists(searchedText);
      } catch {
        setAlertProps({ type: 'error', position: 'top', text: 'Something went wrong with search artists :(' });
        return [];
      }
    },
    ...options,
  });
};

export const useArtistQuery = (
  id: string,
  options?: Partial<UseQueryOptions<ArtistType | null>>
): UseQueryResult<ArtistType | null, Error> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [ARTIST_QUERY, id],
    queryFn: async () => {
      try {
        return await getArtist(id);
      } catch {
        setAlertProps({ text: 'Something went wrong with artist :(', position: 'top', type: 'error' });
        return null;
      }
    },
    ...options,
  });
};

export const useRelatedArtistsQuery = (id: string): UseQueryResult<ArtistType[], Error> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [RELATED_ARTISTS_QUERY, id],
    queryFn: async () => {
      try {
        return await getRelatedArtists(id);
      } catch {
        setAlertProps({ position: 'top', text: 'Something went wrong with related artsits :(', type: 'error' });
        return [];
      }
    },
  });
};

export const useArtistAlbumsQuery = (id: string): UseQueryResult<AlbumType[], Error> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [ARTIST_ALBUMS_QUERY, id],
    queryFn: async () => {
      try {
        return await getArtistAlbums(id);
      } catch {
        setAlertProps({ type: 'error', position: 'top', text: 'Something went wront with artist albums :(' });
        return [];
      }
    },
  });
};

export const useTopUserArtistsQuery = (
  options?: Partial<UseQueryOptions<ArtistType[]>>
): UseQueryResult<ArtistType[], Error> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [TOP_USER_ARTISTS_QUERY],
    queryFn: async () => {
      try {
        return await getTopUserArtists();
      } catch {
        setAlertProps({ text: 'Something went wrong with top user artists :(', type: 'error', position: 'top' });
        return [];
      }
    },
    ...options,
  });
};
