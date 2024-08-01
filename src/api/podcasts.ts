import { isShow, isShowsEpisodesResponse, isShowsResponse } from 'src/utils/guards';
import { getHeaders } from '.';
import { BASE_URL, PODCAST_EPISODES_QUERY, PODCAST_QUERY, PODCASTS_QUERY } from './constants';
import { EpisodeType, ShowType } from 'src/types/types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

const getPodcasts = async (searchedText: string): Promise<ShowType[]> => {
  const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(searchedText)}&type=show`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch podcasts from Spotify API');

  const responseJson: unknown = await response.json();

  return isShowsResponse(responseJson) ? responseJson.shows.items : [];
};

const getPodcast = async (id: string): Promise<ShowType | null> => {
  const response = await fetch(`${BASE_URL}/shows/${id}`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch podcast from Spotify API');

  const responseJson: unknown = await response.json();

  return isShow(responseJson) ? responseJson : null;
};

const getPodcastEpisodes = async (id: string): Promise<EpisodeType[]> => {
  const response = await fetch(`${BASE_URL}/shows/${id}/episodes`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch podcast episodes from Spotify API');

  const responseJson: unknown = await response.json();

  return isShowsEpisodesResponse(responseJson) ? responseJson.items : [];
};

export const usePodcastsQuery = (searchedText: string): UseQueryResult<ShowType[], Error> =>
  useQuery({
    queryKey: [PODCASTS_QUERY, searchedText],
    queryFn: async () => {
      return await getPodcasts(searchedText);
    },
  });

export const usePodcastQuery = (id: string): UseQueryResult<ShowType | null, Error> =>
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
