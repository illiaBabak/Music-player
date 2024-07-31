import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';
import { TrackType } from 'src/types/types';
import { isAlbumTracksResponse, isTopTracks, isTrack, isTrackResponse, isTrackResponseObj } from 'src/utils/guards';
import {
  ALBUM_TRACKS_QUERY,
  BASE_URL,
  RECOMMENDATIONS_QUERY,
  TOP_TRACKS_QUERY,
  TOP_USER_TRACKS_QUERY,
  TRACKS_QUERY,
} from './constants';
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

  return isTrackResponseObj(responseJson) ? responseJson.tracks : [];
};

const getTrack = async (id: string): Promise<TrackType | null> => {
  const response = await fetch(`${BASE_URL}/tracks/${id}`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch track from Spotify API');

  const responseJson: unknown = await response.json();

  return isTrack(responseJson) ? responseJson : null;
};

const getAlbumTracks = async (id: string): Promise<TrackType[] | null> => {
  const response = await fetch(`${BASE_URL}/albums/${id}/tracks`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch album tracks from Spotify API');

  const responseJson: unknown = await response.json();

  if (!isAlbumTracksResponse(responseJson)) return null;

  const tracksId = responseJson.items.map((el) => el.id);

  const trackPromises = tracksId.map((trackId) => getTrack(trackId));

  const tracks = (await Promise.all(trackPromises)).filter((track): track is TrackType => track !== null);

  return tracks;
};

const getArtistTopTracks = async (id: string): Promise<TrackType[]> => {
  const response = await fetch(`${BASE_URL}/artists/${id}/top-tracks`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch top tracks from Spotify API');

  const responseJson: unknown = await response.json();

  return isTrackResponseObj(responseJson) ? responseJson.tracks : [];
};

const getTopUserTracks = async (): Promise<TrackType[]> => {
  const response = await fetch(`${BASE_URL}/me/top/tracks`, {
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error('Failed to fetch top user tracks from Spotify API');

  const responseJson: unknown = await response.json();

  return isTopTracks(responseJson) ? responseJson.items : [];
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

export const useAlbumTracksQuery = (id: string): UseQueryResult<TrackType[] | null, Error> =>
  useQuery({
    queryKey: [ALBUM_TRACKS_QUERY, id],
    queryFn: async () => {
      return await getAlbumTracks(id);
    },
  });

export const useArtistTopTracksQuery = (id: string): UseQueryResult<TrackType[], Error> =>
  useQuery({
    queryKey: [TOP_TRACKS_QUERY, id],
    queryFn: async () => {
      return await getArtistTopTracks(id);
    },
  });

export const useTopUserTracksQuery = (
  options?: Partial<UseQueryOptions<TrackType[]>>
): UseQueryResult<TrackType[], Error> =>
  useQuery({ queryKey: [TOP_USER_TRACKS_QUERY], queryFn: getTopUserTracks, ...options });
