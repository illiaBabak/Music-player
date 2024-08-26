import { isPodcast, isShowsEpisodesResponse, isPodcastsResponse, isUserPodcasts } from 'src/utils/guards';
import { getHeaders } from '.';
import {
  BASE_URL,
  PODCAST_ADD,
  PODCAST_EPISODES_QUERY,
  PODCAST_MUTATION,
  PODCAST_QUERY,
  PODCASTS_QUERY,
  USER_PODCASTS,
} from './constants';
import { EpisodeType, PodcastType } from 'src/types/types';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { redirectToLogin } from 'src/utils/redirect';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';

const getPodcasts = async (searchedText: string): Promise<PodcastType[]> => {
  const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(searchedText)}&type=show`, {
    headers: getHeaders(),
  });

  if (response.status === 401) redirectToLogin();

  if (!response.ok) throw new Error('Failed to fetch podcasts from Spotify API');

  const responseJson: unknown = await response.json();

  return isPodcastsResponse(responseJson) ? responseJson.shows.items : [];
};

const getPodcast = async (id: string): Promise<PodcastType | null> => {
  const response = await fetch(`${BASE_URL}/shows/${id}`, {
    headers: getHeaders(),
  });

  if (response.status === 401) redirectToLogin();

  if (!response.ok) throw new Error('Failed to fetch podcast from Spotify API');

  const responseJson: unknown = await response.json();

  return isPodcast(responseJson) ? responseJson : null;
};

const getPodcastEpisodes = async (id: string): Promise<EpisodeType[]> => {
  const response = await fetch(`${BASE_URL}/shows/${id}/episodes`, {
    headers: getHeaders(),
  });

  if (response.status === 401) redirectToLogin();

  if (!response.ok) throw new Error('Failed to fetch podcast episodes from Spotify API');

  const responseJson: unknown = await response.json();

  return isShowsEpisodesResponse(responseJson) ? responseJson.items : [];
};

const getUserSavedPodcasts = async (): Promise<PodcastType[]> => {
  const response = await fetch(`${BASE_URL}/me/shows`, {
    headers: getHeaders(),
  });

  if (response.status === 401) redirectToLogin();

  if (!response.ok) throw new Error('Failed to fetch user saved shows from Spotify API');

  const responseJson: unknown = await response.json();

  return isUserPodcasts(responseJson) ? responseJson.items.map((item) => item.show) : [];
};

const addPodcast = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/me/shows`, {
    headers: getHeaders(),
    method: 'PUT',
    body: JSON.stringify([id]),
  });

  if (response.status === 401) redirectToLogin();

  if (!response.ok) throw new Error('Failed to add podcast using Spotify API');
};

export const usePodcastsQuery = (
  searchedText: string,
  options?: Partial<UseQueryOptions<PodcastType[]>>
): UseQueryResult<PodcastType[], Error> =>
  useQuery({
    queryKey: [PODCASTS_QUERY, searchedText],
    queryFn: async () => {
      return await getPodcasts(searchedText);
    },
    ...options,
  });

export const usePodcastQuery = (id: string): UseQueryResult<PodcastType | null, Error> =>
  useQuery({
    queryKey: [PODCAST_QUERY, id],
    queryFn: async () => {
      return await getPodcast(id);
    },
  });

export const usePodcastEpisodesQuery = (id: string): UseQueryResult<EpisodeType[], Error> =>
  useQuery({
    queryKey: [PODCAST_EPISODES_QUERY, id],
    queryFn: async () => {
      return await getPodcastEpisodes(id);
    },
  });

export const useUserSavedPodcasts = (
  options?: Partial<UseQueryOptions<PodcastType[]>>
): UseQueryResult<PodcastType[]> =>
  useQuery({
    queryKey: [USER_PODCASTS],
    queryFn: getUserSavedPodcasts,
    ...options,
  });

export const useAddPodcast = (): UseMutationResult<void, Error, string, { prevVal: PodcastType[] | undefined }> => {
  const queryClient = useQueryClient();
  const { setAlertProps } = useContext(GlobalContext);

  return useMutation({
    mutationKey: [PODCAST_MUTATION, PODCAST_ADD],
    mutationFn: addPodcast,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [USER_PODCASTS] });

      const prevVal = queryClient.getQueryData<PodcastType[] | undefined>([USER_PODCASTS]);

      queryClient.setQueryData([USER_PODCASTS], (prev: PodcastType[]) => (prev ? [...prev, { id }] : prev));

      return { prevVal };
    },

    onSettled: (_, __, id) => {
      queryClient.invalidateQueries({ queryKey: [USER_PODCASTS] });
      queryClient.invalidateQueries({ queryKey: [PODCAST_QUERY, id] });
    },

    onSuccess: () => {
      setAlertProps({ type: 'success', text: 'Added podcast', position: 'top' });
    },

    onError: (_, __, context) => {
      setAlertProps({ type: 'error', text: 'Error', position: 'top' });

      queryClient.setQueryData([USER_PODCASTS], context?.prevVal);
    },
  });
};
