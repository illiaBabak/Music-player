import { isPodcast, isShowsEpisodesResponse, isPodcastsResponse, isUserPodcasts } from 'src/utils/guards';
import { fetchWithRedirects } from '.';
import {
  BASE_URL,
  PODCAST_ADD,
  PODCAST_DELETE,
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
import { useContext } from 'react';
import { GlobalContext } from 'src/root';

const getPodcasts = async (searchedText: string): Promise<PodcastType[]> => {
  const result = await fetchWithRedirects(`${BASE_URL}/search?q=${encodeURIComponent(searchedText)}&type=show`, 'GET');

  if (!result) throw new Error('Failed to fetch podcasts from Spotify API');

  return isPodcastsResponse(result) ? result.shows.items : [];
};

const getPodcast = async (id: string): Promise<PodcastType | null> => {
  const result = await fetchWithRedirects(`${BASE_URL}/shows/${id}`, 'GET');

  if (!result) throw new Error('Failed to fetch podcast from Spotify API');

  return isPodcast(result) ? result : null;
};

const getPodcastEpisodes = async (id: string): Promise<EpisodeType[]> => {
  const result = await fetchWithRedirects(`${BASE_URL}/shows/${id}/episodes`, 'GET');

  if (!result) throw new Error('Failed to fetch podcast episodes from Spotify API');

  return isShowsEpisodesResponse(result) ? result.items : [];
};

const getUserSavedPodcasts = async (): Promise<PodcastType[]> => {
  const result = await fetchWithRedirects(`${BASE_URL}/me/shows`, 'GET');

  if (!result) throw new Error('Failed to fetch user saved shows from Spotify API');

  return isUserPodcasts(result) ? result.items.map((item) => item.show) : [];
};

const addPodcast = async (id: string): Promise<void> => {
  const response = await fetchWithRedirects(`${BASE_URL}/me/shows`, 'PUT', JSON.stringify([id]));

  if (!response) throw new Error('Failed to add podcast using Spotify API');
};

const deletePodcast = async (id: string): Promise<void> => {
  const response = await fetchWithRedirects(`${BASE_URL}/me/shows`, 'DELETE', JSON.stringify([id]));

  if (!response) throw new Error('Failed to delete podcast using Spotify API');
};

export const usePodcastsQuery = (
  searchedText: string,
  options?: Partial<UseQueryOptions<PodcastType[]>>
): UseQueryResult<PodcastType[], Error> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [PODCASTS_QUERY, searchedText],
    queryFn: async () => {
      try {
        return await getPodcasts(searchedText);
      } catch {
        setAlertProps({ text: 'Something went wrong with podcasts :(', type: 'error', position: 'top' });
        return [];
      }
    },
    ...options,
  });
};

export const usePodcastQuery = (id: string): UseQueryResult<PodcastType | null, Error> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [PODCAST_QUERY, id],
    queryFn: async () => {
      try {
        return await getPodcast(id);
      } catch {
        setAlertProps({ text: 'Something went wrong with podcast :(', type: 'error', position: 'top' });
      }
    },
  });
};

export const usePodcastEpisodesQuery = (id: string): UseQueryResult<EpisodeType[], Error> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [PODCAST_EPISODES_QUERY, id],
    queryFn: async () => {
      try {
        return await getPodcastEpisodes(id);
      } catch {
        setAlertProps({ type: 'error', text: 'Something went wrong with episodes :(', position: 'top' });
        return [];
      }
    },
  });
};

export const useUserSavedPodcasts = (
  options?: Partial<UseQueryOptions<PodcastType[]>>
): UseQueryResult<PodcastType[]> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [USER_PODCASTS],
    queryFn: async () => {
      try {
        return await getUserSavedPodcasts();
      } catch {
        setAlertProps({ type: 'error', text: 'Something went wrong with your podcasts :(', position: 'top' });
        return [];
      }
    },
    ...options,
  });
};

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

export const useDeletePodcast = (): UseMutationResult<void, Error, string, { prevVal: PodcastType[] | undefined }> => {
  const queryClient = useQueryClient();
  const { setAlertProps } = useContext(GlobalContext);

  return useMutation({
    mutationKey: [PODCAST_MUTATION, PODCAST_DELETE],
    mutationFn: deletePodcast,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [USER_PODCASTS] });

      const prevVal = queryClient.getQueryData<PodcastType[] | undefined>([USER_PODCASTS]);

      queryClient.setQueryData([USER_PODCASTS], (prev: PodcastType[]) =>
        prev ? prev.filter((podcast) => podcast.id !== id) : []
      );

      return { prevVal };
    },

    onSettled: (_, __, id) => {
      queryClient.invalidateQueries({ queryKey: [USER_PODCASTS] });
      queryClient.invalidateQueries({ queryKey: [PODCAST_QUERY, id] });
    },

    onSuccess: () => {
      setAlertProps({ type: 'success', text: 'Deleted podcast', position: 'top' });
    },

    onError: (_, __, context) => {
      setAlertProps({ type: 'error', text: 'Error with delete', position: 'top' });

      queryClient.setQueryData([USER_PODCASTS], context?.prevVal);
    },
  });
};
