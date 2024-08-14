import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { PlaylistItemsResponse, PlaylistType } from 'src/types/types';
import { isFeaturedPlaylists, isPlaylist, isPlaylistItemsResponse, isPlaylistsResponse } from 'src/utils/guards';
import {
  BASE_URL,
  FEATURED_PLAYLISTS_QUERY,
  PLAYLIST_ADD,
  PLAYLIST_ADD_ITEMS,
  PLAYLIST_DELETE,
  PLAYLIST_EDIT,
  PLAYLIST_IMAGE_UPLOAD,
  PLAYLIST_ITEMS_QUERY,
  PLAYLIST_MUTATION,
  PLAYLIST_QUERY,
  PLAYLISTS_QUERY,
} from './constants';
import { getHeaders } from '.';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';
import { BASE64_PATTERN } from 'src/utils/constants';

const getPlaylist = async (playlistId: string): Promise<PlaylistType | null> => {
  const response = await fetch(`${BASE_URL}/playlists/${playlistId}`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch playlist');

  const responseJson: unknown = await response.json();

  return isPlaylist(responseJson) ? responseJson : null;
};

const getPlaylists = async (): Promise<PlaylistType[]> => {
  const response = await fetch(`${BASE_URL}/me/playlists`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch playlists');

  const responseJson: unknown = await response.json();

  return isPlaylistsResponse(responseJson) ? responseJson.items : [];
};

const getPlaylistItems = async (playlistId: string): Promise<PlaylistItemsResponse | null> => {
  const response = await fetch(`${BASE_URL}/playlists/${playlistId}/tracks`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch playlist items');

  const responseJson: unknown = await response.json();

  return isPlaylistItemsResponse(responseJson) ? responseJson : null;
};

const getFeaturedPlaylists = async (): Promise<PlaylistType[]> => {
  const response = await fetch(`${BASE_URL}/browse/featured-playlists`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch featured playlists from Spotify API');

  const responseJson: unknown = await response.json();

  return isFeaturedPlaylists(responseJson) ? responseJson.playlists.items : [];
};

const addPlaylist = async ({
  playlistToCreate,
  userId,
}: {
  playlistToCreate: Partial<PlaylistType>;
  userId: string;
}): Promise<void> => {
  const response = await fetch(`${BASE_URL}/users/${userId}/playlists`, {
    headers: getHeaders(),
    method: 'POST',
    body: JSON.stringify(playlistToCreate),
  });

  if (!response.ok) throw new Error('Failed to add a new playlist using Spotify API');
};

const deletePlaylist = async (playlistId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/playlists/${playlistId}/followers`, {
    headers: getHeaders(),
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Failed to delete a playlist using Spotify API');
};

const editPlaylist = async ({
  editedPlaylist,
  playlistId,
}: {
  editedPlaylist: Partial<PlaylistType>;
  playlistId: string;
}): Promise<void> => {
  const response = await fetch(`${BASE_URL}/playlists/${playlistId}`, {
    headers: getHeaders(),
    method: 'PUT',
    body: JSON.stringify(editedPlaylist),
  });

  if (!response.ok) throw new Error('Failed to edit a playlist using Spotify API');
};

const addCustomPlaylistImage = async ({ playlistId, image }: { playlistId: string; image: string }): Promise<void> => {
  const base64Data = image.replace(BASE64_PATTERN, '');

  if (!base64Data) return;

  const response = await fetch(`${BASE_URL}/playlists/${playlistId}/images`, {
    headers: {
      ...getHeaders(),
      'Content-Type': 'image/jpeg',
    },
    method: 'PUT',
    body: base64Data,
  });

  if (!response.ok) throw new Error('Failed to add custom img to playlist using Spotify API');
};

const addTracksToPlaylist = async ({ playlistId, uris }: { playlistId: string; uris: string[] }): Promise<void> => {
  const response = await fetch(`${BASE_URL}/playlists/${playlistId}/tracks`, {
    headers: getHeaders(),
    method: 'POST',
    body: JSON.stringify({
      uris: [...uris],
      position: 0,
    }),
  });

  if (!response.ok) throw new Error('Failed to add items to playlist using Spotify API');
};

export const usePlaylistsQuery = (
  options?: Partial<UseQueryOptions<PlaylistType[]>>
): UseQueryResult<PlaylistType[], Error> =>
  useQuery({
    queryKey: [PLAYLISTS_QUERY],
    queryFn: getPlaylists,
    ...options,
  });

export const usePlaylistsItemsQuery = (
  playlistId: string,
  options?: Partial<UseQueryOptions<PlaylistItemsResponse | null>>
): UseQueryResult<PlaylistItemsResponse | null, Error> =>
  useQuery({
    queryKey: [PLAYLIST_ITEMS_QUERY, playlistId],
    queryFn: async (): Promise<PlaylistItemsResponse | null> => {
      return await getPlaylistItems(playlistId);
    },
    ...options,
  });

export const usePlaylistQuery = (playlistId: string): UseQueryResult<PlaylistType, Error> =>
  useQuery({
    queryKey: [PLAYLIST_QUERY, playlistId],
    queryFn: async () => {
      return await getPlaylist(playlistId);
    },
  });

export const useFeaturedPlaylistsQuery = (
  options?: Partial<UseQueryOptions<PlaylistType[]>>
): UseQueryResult<PlaylistType[], Error> =>
  useQuery({ queryKey: [FEATURED_PLAYLISTS_QUERY], queryFn: getFeaturedPlaylists, ...options });

export const useAddPlaylist = (): UseMutationResult<
  void,
  Error,
  { playlistToCreate: Partial<PlaylistType>; userId: string },
  {
    prevVal: PlaylistType[] | undefined;
  }
> => {
  const queryClient = useQueryClient();
  const { setAlertProps } = useContext(GlobalContext);

  return useMutation({
    mutationKey: [PLAYLIST_MUTATION, PLAYLIST_ADD],
    mutationFn: addPlaylist,
    onMutate: async ({ playlistToCreate }) => {
      await queryClient.cancelQueries({ queryKey: [PLAYLISTS_QUERY] });

      const prevVal = queryClient.getQueryData<PlaylistType[] | undefined>([PLAYLISTS_QUERY]);

      queryClient.setQueryData([PLAYLISTS_QUERY], (prev: PlaylistType[]) => [playlistToCreate, ...prev]);

      return { prevVal };
    },

    onSuccess: () => {
      setAlertProps({ text: 'Success', type: 'success', position: 'top' });

      queryClient.invalidateQueries({ queryKey: [PLAYLISTS_QUERY] });
    },

    onError: (_, __, context) => {
      setAlertProps({ text: 'Error', type: 'error', position: 'top' });

      queryClient.setQueryData([PLAYLISTS_QUERY], context?.prevVal);
    },
  });
};

export const useDeletePlaylist = (): UseMutationResult<
  void,
  Error,
  string,
  {
    prevVal: PlaylistType[] | undefined;
  }
> => {
  const queryClient = useQueryClient();
  const { setAlertProps } = useContext(GlobalContext);

  return useMutation({
    mutationKey: [PLAYLIST_MUTATION, PLAYLIST_DELETE],
    mutationFn: deletePlaylist,
    onMutate: async (playlistId) => {
      await queryClient.cancelQueries({ queryKey: [PLAYLISTS_QUERY] });

      const prevVal = queryClient.getQueryData<PlaylistType[] | undefined>([PLAYLISTS_QUERY]);

      queryClient.setQueryData([PLAYLISTS_QUERY], (prev: PlaylistType[]) =>
        prev ? prev.filter((playlist) => playlist.id !== playlistId) : []
      );

      return { prevVal };
    },

    onSuccess: () => {
      setAlertProps({ text: 'Success', type: 'success', position: 'top' });

      queryClient.invalidateQueries({ queryKey: [PLAYLISTS_QUERY] });
    },

    onError: (_, __, context) => {
      setAlertProps({ text: 'Error', type: 'error', position: 'top' });

      queryClient.setQueryData([PLAYLISTS_QUERY], context?.prevVal);
    },
  });
};

export const useEditPlaylist = (): UseMutationResult<
  void,
  Error,
  {
    editedPlaylist: Partial<PlaylistType>;
    playlistId: string;
  },
  {
    prevVal: PlaylistType[] | undefined;
  }
> => {
  const queryClient = useQueryClient();
  const { setAlertProps } = useContext(GlobalContext);

  return useMutation({
    mutationFn: editPlaylist,
    mutationKey: [PLAYLIST_MUTATION, PLAYLIST_EDIT],
    onMutate: async ({ editedPlaylist, playlistId }) => {
      await queryClient.cancelQueries({ queryKey: [PLAYLISTS_QUERY] });

      const prevVal = queryClient.getQueryData<PlaylistType[] | undefined>([PLAYLISTS_QUERY]);

      queryClient.setQueryData([PLAYLISTS_QUERY, playlistId], (prev: PlaylistType[]) =>
        prev ? prev.map((playlist) => (playlist.id === playlistId ? { ...playlist, ...editedPlaylist } : playlist)) : []
      );

      return { prevVal };
    },

    onSuccess: () => {
      setAlertProps({ text: 'Success', type: 'success', position: 'top' });

      queryClient.invalidateQueries({ queryKey: [PLAYLISTS_QUERY] });
    },

    onError: (_, __, context) => {
      setAlertProps({ text: 'Error', type: 'error', position: 'top' });

      queryClient.setQueryData([PLAYLISTS_QUERY], context?.prevVal);
    },
  });
};

export const useCustomImagePlaylist = (): UseMutationResult<
  void,
  Error,
  { playlistId: string; image: string },
  { prevVal: PlaylistType[] | undefined }
> => {
  const queryClient = useQueryClient();
  const { setAlertProps } = useContext(GlobalContext);

  return useMutation({
    mutationKey: [PLAYLIST_MUTATION, PLAYLIST_IMAGE_UPLOAD],
    mutationFn: addCustomPlaylistImage,
    onMutate: async ({ playlistId, image }) => {
      await queryClient.cancelQueries({ queryKey: [PLAYLISTS_QUERY] });

      const prevVal = queryClient.getQueryData<PlaylistType[] | undefined>([PLAYLISTS_QUERY]);

      queryClient.setQueryData([PLAYLISTS_QUERY], (prev: PlaylistType[]) =>
        prev.map((playlist) => (playlist.id === playlistId ? { ...playlist, images: [{ url: image }] } : playlist))
      );

      return { prevVal };
    },

    onSuccess: () => {
      setAlertProps({ text: 'Success', type: 'success', position: 'top' });

      queryClient.invalidateQueries({ queryKey: [PLAYLISTS_QUERY] });
    },

    onError: (_, __, context) => {
      setAlertProps({ text: 'Error', type: 'error', position: 'top' });

      queryClient.setQueryData([PLAYLISTS_QUERY], context?.prevVal);
    },
  });
};

export const useAddItemsPlaylist = (): UseMutationResult<
  void,
  Error,
  { playlistId: string; uris: string[] },
  { prevVal: PlaylistItemsResponse | undefined }
> => {
  const queryClient = useQueryClient();
  const { setAlertProps } = useContext(GlobalContext);

  return useMutation({
    mutationKey: [PLAYLIST_MUTATION, PLAYLIST_ADD_ITEMS],
    mutationFn: addTracksToPlaylist,

    onMutate: async ({ playlistId, uris }) => {
      await queryClient.cancelQueries({ queryKey: [PLAYLIST_ITEMS_QUERY, playlistId] });

      const prevVal = queryClient.getQueryData<PlaylistItemsResponse | undefined>([PLAYLIST_ITEMS_QUERY, playlistId]);

      queryClient.setQueryData([PLAYLIST_ITEMS_QUERY, playlistId], (prev: PlaylistItemsResponse | undefined) => ({
        ...prev,
        items: [...(prev?.items ?? []), ...uris.map((uri) => ({ track: { uri } }))],
      }));

      return { prevVal };
    },

    onSuccess: (_, { playlistId }) => {
      setAlertProps({ text: 'Success', type: 'success', position: 'top' });
      queryClient.invalidateQueries({ queryKey: [PLAYLISTS_QUERY] });
      queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY, playlistId] });
      queryClient.invalidateQueries({ queryKey: [PLAYLIST_ITEMS_QUERY] });
    },

    onError: (_, __, context) => {
      setAlertProps({ text: 'Error', type: 'error', position: 'top' });
      queryClient.setQueryData([PLAYLIST_ITEMS_QUERY], context?.prevVal);
    },
  });
};
