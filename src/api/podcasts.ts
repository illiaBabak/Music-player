import { isPodcast, isShowsEpisodesResponse, isPodcastsResponse, isUserPodcasts } from 'src/utils/guards';
import { getHeaders } from '.';
import { BASE_URL, PODCAST_EPISODES_QUERY, PODCAST_QUERY, PODCASTS_QUERY, USER_PODCASTS } from './constants';
import { EpisodeType, PodcastType } from 'src/types/types';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { redirectToLogin } from 'src/utils/redirect';

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
