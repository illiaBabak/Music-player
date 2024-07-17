import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { PlaylistItemsResponse, PlaylistType } from 'src/types/types';
import { isPlaylist, isPlaylistItemsResponse, isPlaylistsResponse } from 'src/utils/guards';
import { PLAYLIST_ITEMS_QUERY, PLAYLIST_QUERY, PLAYLISTS_QUERY } from './constants';

const BASE_URL = 'https://api.spotify.com/v1';

const getPlaylist = async (playlistId: string): Promise<PlaylistType | null> => {
  const token = localStorage.getItem('spotify_token');

  const response = await fetch(`${BASE_URL}/playlists/${playlistId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch playlist');

  const responseJson: unknown = await response.json();

  return isPlaylist(responseJson) ? responseJson : null;
};

const getPlaylists = async (): Promise<PlaylistType[]> => {
  const token = localStorage.getItem('spotify_token');

  const response = await fetch(`${BASE_URL}/me/playlists`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch playlists');

  const responseJson: unknown = await response.json();

  return isPlaylistsResponse(responseJson) ? responseJson.items : [];
};

const getPlaylistItems = async (playlistId: string): Promise<PlaylistItemsResponse | null> => {
  const token = localStorage.getItem('spotify_token');

  const response = await fetch(`${BASE_URL}/playlists/${playlistId}/tracks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch playlist items');

  const responseJson: unknown = await response.json();

  return isPlaylistItemsResponse(responseJson) ? responseJson : null;
};

export const usePlaylists = (
  options?: Partial<UseQueryOptions<PlaylistType[]>>
): UseQueryResult<PlaylistType[], Error> =>
  useQuery({
    queryKey: [PLAYLISTS_QUERY],
    queryFn: getPlaylists,
    ...options,
  });

export const usePlaylistsItems = (playlistId: string): UseQueryResult<PlaylistItemsResponse, Error> =>
  useQuery({
    queryKey: [PLAYLIST_ITEMS_QUERY, playlistId],
    queryFn: async () => {
      return await getPlaylistItems(playlistId);
    },
  });

export const usePlaylist = (playlistId: string): UseQueryResult<PlaylistType, Error> =>
  useQuery({
    queryKey: [PLAYLIST_QUERY, playlistId],
    queryFn: async () => {
      return await getPlaylist(playlistId);
    },
  });
