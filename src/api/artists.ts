import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { AlbumType, ArtistType } from 'src/types/types';
import { isAlbumResponseObj, isArtist, isArtistsResponse, isArtistsResponseObj } from 'src/utils/guards';
import { ARTIST_ALBUMS_QUERY, ARTIST_QUERY, ARTISTS_QUERY, BASE_URL, RELATED_ARTISTS_QUERY } from './constants';
import { getHeaders } from '.';

const getArtists = async (searchedText: string): Promise<ArtistType[]> => {
  const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(searchedText)}&type=artist`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch artists from Spotify API');

  const responseJson: unknown = await response.json();

  return isArtistsResponse(responseJson) ? responseJson.artists.items : [];
};

const getArtist = async (id: string): Promise<ArtistType | null> => {
  const response = await fetch(`${BASE_URL}/artists/${id}`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch artist from Spotify API');

  const responseJson: unknown = await response.json();

  return isArtist(responseJson) ? responseJson : null;
};

const getRelatedArtists = async (id: string): Promise<ArtistType[]> => {
  const response = await fetch(`${BASE_URL}/artists/${id}/related-artists`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch related artists from Spotify API');

  const responseJson: unknown = await response.json();

  return isArtistsResponseObj(responseJson) ? responseJson.artists : [];
};

const getArtistAlbums = async (id: string): Promise<AlbumType[]> => {
  const response = await fetch(`${BASE_URL}/artists/${id}/albums`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch artist albums from Spotify API');

  const responseJson: unknown = await response.json();

  return isAlbumResponseObj(responseJson) ? responseJson.items : [];
};

export const useSearchArtistQuery = (
  searchedText: string,
  options?: Partial<UseQueryOptions<ArtistType[]>>
): UseQueryResult<ArtistType[], Error> =>
  useQuery({
    queryKey: [ARTISTS_QUERY, searchedText],
    queryFn: async () => {
      return await getArtists(searchedText);
    },
    ...options,
  });

export const useArtistQuery = (
  id: string,
  options?: Partial<UseQueryOptions<ArtistType | null>>
): UseQueryResult<ArtistType | null, Error> =>
  useQuery({
    queryKey: [ARTIST_QUERY, id],
    queryFn: async () => {
      return await getArtist(id);
    },
    ...options,
  });

export const useRelatedArtists = (id: string): UseQueryResult<ArtistType[], Error> =>
  useQuery({
    queryKey: [RELATED_ARTISTS_QUERY, id],
    queryFn: async () => {
      return await getRelatedArtists(id);
    },
  });

export const useArtistAlbums = (id: string): UseQueryResult<AlbumType[], Error> =>
  useQuery({
    queryKey: [ARTIST_ALBUMS_QUERY, id],
    queryFn: async () => {
      return await getArtistAlbums(id);
    },
  });
