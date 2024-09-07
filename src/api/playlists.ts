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
  PLAYLIST_DELETE_TRACK,
  PLAYLIST_EDIT,
  PLAYLIST_IMAGE_UPLOAD,
  PLAYLIST_ITEMS_QUERY,
  PLAYLIST_MUTATION,
  PLAYLIST_QUERY,
  PLAYLISTS_QUERY,
} from './constants';
import { fetchWithRedirects } from '.';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';
import { BASE64_PATTERN } from 'src/utils/constants';

type PartialPlaylistWithId = Pick<PlaylistType, 'id'> & Partial<PlaylistType>;

const getPlaylist = async (playlistId: string): Promise<PlaylistType | null> => {
  const result = await fetchWithRedirects(`${BASE_URL}/playlists/${playlistId}`, 'GET');

  if (!result) throw new Error('Failed to fetch playlist');

  return isPlaylist(result) ? result : null;
};

const getPlaylists = async (): Promise<PlaylistType[]> => {
  const result = await fetchWithRedirects(`${BASE_URL}/me/playlists`, 'GET');

  if (!result) throw new Error('Failed to fetch playlists');

  return isPlaylistsResponse(result) ? result.items : [];
};

const getPlaylistItems = async (playlistId: string): Promise<PlaylistItemsResponse | null> => {
  const result = await fetchWithRedirects(`${BASE_URL}/playlists/${playlistId}/tracks`, 'GET');

  if (!result) throw new Error('Failed to fetch playlist items');

  return isPlaylistItemsResponse(result) ? result : null;
};

const getFeaturedPlaylists = async (): Promise<PlaylistType[]> => {
  const result = await fetchWithRedirects(`${BASE_URL}/browse/featured-playlists`, 'GET');

  if (!result) throw new Error('Failed to fetch featured playlists from Spotify API');

  return isFeaturedPlaylists(result) ? result.playlists.items : [];
};

const addPlaylist = async ({
  playlistToCreate,
  userId,
}: {
  playlistToCreate: Partial<PlaylistType>;
  userId: string;
}): Promise<void> => {
  const response = await fetchWithRedirects(
    `${BASE_URL}/users/${userId}/playlists`,
    'POST',
    JSON.stringify(playlistToCreate)
  );

  if (!response) throw new Error('Failed to add a new playlist using Spotify API');
};

const deletePlaylist = async (playlistId: string): Promise<void> => {
  const response = await fetchWithRedirects(`${BASE_URL}/playlists/${playlistId}/followers`, 'DELETE');

  if (!response) throw new Error('Failed to delete a playlist using Spotify API');
};

const editPlaylist = async (partialPlaylist: PartialPlaylistWithId): Promise<void> => {
  const response = await fetchWithRedirects(
    `${BASE_URL}/playlists/${partialPlaylist.id}`,
    'PUT',
    JSON.stringify(partialPlaylist)
  );

  if (!response) throw new Error('Failed to edit a playlist using Spotify API');
};

const addCustomPlaylistImage = async ({ playlistId, image }: { playlistId: string; image: string }): Promise<void> => {
  const base64Data = image.replace(BASE64_PATTERN, '');

  if (!base64Data) return;

  const response = await fetchWithRedirects(`${BASE_URL}/playlists/${playlistId}/images`, 'PUT', base64Data, {
    'Content-Type': 'image/jpeg',
  });

  if (!response) throw new Error('Failed to add custom img to playlist using Spotify API');
};

const addTracksToPlaylist = async ({ playlistId, uris }: { playlistId: string; uris: string[] }): Promise<void> => {
  const response = await fetchWithRedirects(
    `${BASE_URL}/playlists/${playlistId}/tracks`,
    'POST',
    JSON.stringify({
      uris: [...uris],
      position: 0,
    })
  );

  if (!response) throw new Error('Failed to add items to playlist using Spotify API');
};

const deletePlaylistTrack = async ({ playlistId, uri }: { playlistId: string; uri: string }): Promise<void> => {
  const response = await fetchWithRedirects(
    `${BASE_URL}/playlists/${playlistId}/tracks`,
    'DELETE',
    JSON.stringify({
      tracks: [
        {
          uri,
        },
      ],
    })
  );

  if (!response) throw new Error('Failed to delete track from playlist using Spotify API');
};

export const usePlaylistsQuery = (
  options?: Partial<UseQueryOptions<PlaylistType[]>>
): UseQueryResult<PlaylistType[], Error> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [PLAYLISTS_QUERY],
    queryFn: async () => {
      try {
        return await getPlaylists();
      } catch {
        setAlertProps({ type: 'error', position: 'top', text: 'Something went wrong with playlists :(' });
        return [];
      }
    },
    ...options,
  });
};

export const usePlaylistsItemsQuery = (
  playlistId: string,
  options?: Partial<UseQueryOptions<PlaylistItemsResponse | null>>
): UseQueryResult<PlaylistItemsResponse | null, Error> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [PLAYLIST_ITEMS_QUERY, playlistId],
    queryFn: async (): Promise<PlaylistItemsResponse | null> => {
      try {
        return await getPlaylistItems(playlistId);
      } catch {
        setAlertProps({ type: 'error', position: 'top', text: 'Something went wrong with playlist tracks :(' });
        return null;
      }
    },
    ...options,
  });
};

export const usePlaylistQuery = (playlistId: string): UseQueryResult<PlaylistType, Error> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [PLAYLIST_QUERY, playlistId],
    queryFn: async () => {
      try {
        return await getPlaylist(playlistId);
      } catch {
        setAlertProps({ type: 'error', position: 'top', text: 'Something went wrong with playlist :(' });
        return null;
      }
    },
  });
};

export const useFeaturedPlaylistsQuery = (
  options?: Partial<UseQueryOptions<PlaylistType[]>>
): UseQueryResult<PlaylistType[], Error> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [FEATURED_PLAYLISTS_QUERY],
    queryFn: async () => {
      try {
        return await getFeaturedPlaylists();
      } catch {
        setAlertProps({ text: 'Something went wrong with featured playlists :(', type: 'error', position: 'top' });
        return [];
      }
    },
    ...options,
  });
};

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

      queryClient.setQueryData([PLAYLISTS_QUERY], (prev: PlaylistType[]) =>
        prev ? [playlistToCreate, ...prev] : prev
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
  Pick<PlaylistType, 'id'> & Partial<PlaylistType>,
  {
    prevValList: PlaylistType[] | undefined;
    prevValSingle: PlaylistType | undefined;
  }
> => {
  const queryClient = useQueryClient();
  const { setAlertProps } = useContext(GlobalContext);

  return useMutation({
    mutationFn: editPlaylist,
    mutationKey: [PLAYLIST_MUTATION, PLAYLIST_EDIT],
    onMutate: async (updatedPlaylist) => {
      await queryClient.cancelQueries({ queryKey: [PLAYLISTS_QUERY] });
      await queryClient.cancelQueries({ queryKey: [PLAYLIST_QUERY, updatedPlaylist.id] });

      const prevValList = queryClient.getQueryData<PlaylistType[] | undefined>([PLAYLISTS_QUERY]);
      const prevValSingle = queryClient.getQueryData<PlaylistType | undefined>([PLAYLIST_QUERY, updatedPlaylist.id]);

      queryClient.setQueryData([PLAYLISTS_QUERY], (prev: PlaylistType[] | undefined) =>
        prev
          ? prev.map((playlist) =>
              playlist.id === updatedPlaylist.id ? { ...playlist, ...updatedPlaylist } : playlist
            )
          : []
      );

      queryClient.setQueryData([PLAYLIST_QUERY, updatedPlaylist.id], (prev: PlaylistType | undefined) =>
        prev ? { ...prev, ...updatedPlaylist } : undefined
      );

      return { prevValList, prevValSingle };
    },

    onSettled: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: [PLAYLISTS_QUERY] });
      queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY, context.id] });
    },

    onSuccess: () => {
      setAlertProps({ text: 'Success', type: 'success', position: 'top' });
    },

    onError: (_, __, context) => {
      setAlertProps({ text: 'Error', type: 'error', position: 'top' });

      queryClient.setQueryData([PLAYLISTS_QUERY], context?.prevValList);
      queryClient.setQueryData([PLAYLISTS_QUERY, context?.prevValSingle?.id], context?.prevValSingle);
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
        prev
          ? prev.map((playlist) => (playlist.id === playlistId ? { ...playlist, images: [{ url: image }] } : playlist))
          : []
      );

      return { prevVal };
    },

    onSuccess: (_, { playlistId }) => {
      setAlertProps({ text: 'Success', type: 'success', position: 'top' });

      queryClient.invalidateQueries({ queryKey: [PLAYLISTS_QUERY] });
      queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY, playlistId] });
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
      queryClient.invalidateQueries({ queryKey: [PLAYLIST_QUERY, playlistId] });
      queryClient.invalidateQueries({ queryKey: [PLAYLIST_ITEMS_QUERY] });
    },

    onError: (_, __, context) => {
      setAlertProps({ text: 'Error', type: 'error', position: 'top' });
      queryClient.setQueryData([PLAYLIST_ITEMS_QUERY], context?.prevVal);
    },
  });
};

export const useDeletePlaylistTrack = (): UseMutationResult<
  void,
  Error,
  {
    playlistId: string;
    uri: string;
  },
  { prevVal: PlaylistItemsResponse | undefined }
> => {
  const queryClient = useQueryClient();
  const { setAlertProps } = useContext(GlobalContext);

  return useMutation({
    mutationKey: [PLAYLIST_MUTATION, PLAYLIST_DELETE_TRACK],
    mutationFn: deletePlaylistTrack,
    onMutate: async ({ playlistId, uri }) => {
      await queryClient.cancelQueries({ queryKey: [PLAYLIST_ITEMS_QUERY, playlistId] });

      const prevVal = queryClient.getQueryData<PlaylistItemsResponse | undefined>([PLAYLIST_ITEMS_QUERY, playlistId]);

      queryClient.setQueryData([PLAYLIST_ITEMS_QUERY, playlistId], (prev: PlaylistItemsResponse | undefined) => ({
        ...prev,
        items: prev?.items.filter((item) => item.track.uri !== uri),
      }));

      return { prevVal };
    },

    onSuccess: () => {
      setAlertProps({ text: 'Success', position: 'top', type: 'success' });
      queryClient.invalidateQueries({ queryKey: [PLAYLIST_ITEMS_QUERY] });
    },

    onError: (_, __, context) => {
      setAlertProps({ text: 'Error', position: 'top', type: 'error' });
      queryClient.setQueryData([PLAYLIST_ITEMS_QUERY], context?.prevVal);
    },
  });
};
