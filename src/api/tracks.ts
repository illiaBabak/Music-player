import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';
import { TrackType } from 'src/types/types';
import { isRecommendationsTracksResponse, isTrackResponse } from 'src/utils/guards';
import { BASE_URL, RECOMMENDATIONS_QUERY, TRACKS_QUERY } from './constants';
import { getHeaders } from '.';

const getTracks = async (searchedText: string): Promise<TrackType[]> => {
  const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(searchedText)}&type=track`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch tracks from Spotify API');

  const responseJson: unknown = await response.json();

  return isTrackResponse(responseJson) ? responseJson.tracks.items : [];
};

const getRecommendationTracks = async (): Promise<TrackType[]> => {
  const response = await fetch(`${BASE_URL}/recommendations?limit=20&seed_genres=hip-hop`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch recommendation tracks from Spotify API');

  const responseJson: unknown = await response.json();

  return isRecommendationsTracksResponse(responseJson) ? responseJson.tracks : [];
};

export const useSearchTracksQuery = (
  searchedText: string,
  options?: Partial<UseQueryOptions<TrackType[]>>
): UseQueryResult<TrackType[], Error> =>
  useQuery({
    queryKey: [TRACKS_QUERY, searchedText],
    queryFn: async () => {
      return await getTracks(searchedText);
    },
    ...options,
  });

export const useRecommendationTracksQuery = (
  options?: Partial<UseQueryOptions<TrackType[]>>
): UseQueryResult<TrackType[], Error> =>
  useQuery({
    queryKey: [RECOMMENDATIONS_QUERY],
    queryFn: getRecommendationTracks,
    ...options,
  });
