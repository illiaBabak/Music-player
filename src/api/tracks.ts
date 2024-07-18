import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { TrackType } from 'src/types/types';
import { isTrackResponse } from 'src/utils/guards';
import { BASE_URL, TRACKS_QUERY } from './constants';
import { getHeaders } from '.';

const getTracks = async (searchedText: string): Promise<TrackType[]> => {
  const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(searchedText)}&type=track`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch tracks from Spotify API');

  const responseJson: unknown = await response.json();

  return isTrackResponse(responseJson) ? responseJson.tracks.items : [];
};

export const useSearchTracksQuery = (searchedText: string): UseQueryResult<TrackType[], Error> =>
  useQuery({
    queryKey: [TRACKS_QUERY, searchedText],
    queryFn: async () => {
      return await getTracks(searchedText);
    },
  });
