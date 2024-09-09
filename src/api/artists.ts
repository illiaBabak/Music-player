import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { AlbumType, ArtistType } from 'src/types/types';
import { isAlbumResponseObj, isArtist, isArtistsResponse, isArtistsResponseObj, isTopArtists } from 'src/utils/guards';
import {
  ARTIST_ALBUMS_QUERY,
  ARTIST_QUERY,
  ARTISTS_QUERY,
  BASE_URL,
  FOLLOW_ARTIST_ADD,
  FOLLOW_ARTIST_MUTATION,
  FOLLOW_ARTISTS_QUERY,
  RELATED_ARTISTS_QUERY,
  TOP_USER_ARTISTS_QUERY,
} from './constants';
import { fetchWithRedirects } from '.';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';

type ArtistWithId = Pick<ArtistType, 'id'> & Partial<ArtistType>;

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

const getFollowedArtists = async (): Promise<ArtistType[]> => {
  const result = await fetchWithRedirects(`${BASE_URL}/me/following?type=artist`, 'GET');

  if (!result) throw new Error('Failed to fetch followed artists from Spotify API');

  return isArtistsResponse(result) ? result.artists.items : [];
};

const followArtist = async (partialArtist: ArtistWithId) => {
  const response = await fetchWithRedirects(
    `${BASE_URL}/me/following?type=artist`,
    'PUT',
    JSON.stringify({
      ids: [partialArtist.id],
    })
  );

  if (!response) throw new Error('Failed to follow artist using Spotify API');
};

const unFollowArtist = async (id: string) => {
  const response = await fetchWithRedirects(
    `${BASE_URL}/me/following?type=artist`,
    'DELETE',
    JSON.stringify({
      ids: [id],
    })
  );

  if (!response) throw new Error('Failed to unfollow artist using Spotify API');
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

export const useFollowedArtistsQuery = (): UseQueryResult<ArtistType[], Error> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [FOLLOW_ARTISTS_QUERY],
    queryFn: async () => {
      try {
        return await getFollowedArtists();
      } catch {
        setAlertProps({ text: 'Something went wrong with followes artists :(', type: 'error', position: 'top' });
        return [];
      }
    },
  });
};

export const useFollowArtistQuery = (): UseMutationResult<
  void,
  Error,
  ArtistWithId,
  { prevVal: ArtistType[] | undefined }
> => {
  const { setAlertProps } = useContext(GlobalContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [FOLLOW_ARTIST_MUTATION, FOLLOW_ARTIST_ADD],
    mutationFn: followArtist,
    onMutate: async (artistToFollow) => {
      await queryClient.cancelQueries({ queryKey: [FOLLOW_ARTISTS_QUERY] });

      const prevVal = queryClient.getQueryData<ArtistType[] | undefined>([FOLLOW_ARTISTS_QUERY]);

      queryClient.setQueryData([FOLLOW_ARTISTS_QUERY], (prev: ArtistType[] | undefined) =>
        prev ? [artistToFollow, ...prev] : prev
      );

      return { prevVal };
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [FOLLOW_ARTISTS_QUERY] });
    },

    onSuccess: () => {
      setAlertProps({ text: 'Followed artist', type: 'success', position: 'top' });
    },

    onError: (_, __, context) => {
      setAlertProps({ text: 'Error with follow artist', type: 'error', position: 'top' });

      queryClient.setQueryData([FOLLOW_ARTISTS_QUERY], context?.prevVal);
    },
  });
};

export const useUnFollowArtistQuery = (): UseMutationResult<
  void,
  Error,
  string,
  { prevVal: ArtistType[] | undefined }
> => {
  const { setAlertProps } = useContext(GlobalContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [FOLLOW_ARTIST_MUTATION, FOLLOW_ARTIST_MUTATION],
    mutationFn: unFollowArtist,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [FOLLOW_ARTISTS_QUERY] });

      const prevVal = queryClient.getQueryData<ArtistType[] | undefined>([FOLLOW_ARTISTS_QUERY]);

      queryClient.setQueryData([FOLLOW_ARTISTS_QUERY], (prev: ArtistType[] | undefined) =>
        prev ? prev.filter((artist) => artist.id !== id) : prev
      );

      return { prevVal };
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [FOLLOW_ARTISTS_QUERY] });
    },

    onSuccess: () => {
      setAlertProps({ text: 'Unfollowed artist', position: 'top', type: 'success' });
    },

    onError: (_, __, context) => {
      setAlertProps({ text: 'Error with unfollow artist', position: 'top', type: 'error' });

      queryClient.setQueryData([FOLLOW_ARTISTS_QUERY], context?.prevVal);
    },
  });
};
