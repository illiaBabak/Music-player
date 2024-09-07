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
import { fetchWithRedirects } from '.';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';

const getTracks = async (searchedText: string): Promise<TrackType[]> => {
  const result = await fetchWithRedirects(`${BASE_URL}/search?q=${encodeURIComponent(searchedText)}&type=track`, 'GET');

  if (!result) throw new Error('Failed to fetch tracks from Spotify API');

  return isTrackResponse(result) ? result.tracks.items : [];
};

const getRecommendationTracks = async (): Promise<TrackType[]> => {
  const result = await fetchWithRedirects(`${BASE_URL}/recommendations?limit=20&seed_genres=hip-hop`, 'GET');

  if (!result) throw new Error('Failed to fetch recommendation tracks from Spotify API');

  return isTrackResponseObj(result) ? result.tracks : [];
};

const getTrack = async (id: string): Promise<TrackType | null> => {
  const result = await fetchWithRedirects(`${BASE_URL}/tracks/${id}`, 'GET');

  if (!result) throw new Error('Failed to fetch track from Spotify API');

  return isTrack(result) ? result : null;
};

const getAlbumTracks = async (id: string): Promise<TrackType[] | null> => {
  const result = await fetchWithRedirects(`${BASE_URL}/albums/${id}/tracks`, 'GET');

  if (!result) throw new Error('Failed to fetch album tracks from Spotify API');

  if (!isAlbumTracksResponse(result)) return null;

  const tracksId = result.items.map((el) => el.id);

  const trackPromises = tracksId.map((trackId) => getTrack(trackId));

  const tracks = (await Promise.all(trackPromises)).filter((track): track is TrackType => track !== null);

  return tracks;
};

const getArtistTopTracks = async (id: string): Promise<TrackType[]> => {
  const result = await fetchWithRedirects(`${BASE_URL}/artists/${id}/top-tracks`, 'GET');

  if (!result) throw new Error('Failed to fetch top tracks from Spotify API');

  return isTrackResponseObj(result) ? result.tracks : [];
};

const getTopUserTracks = async (): Promise<TrackType[]> => {
  const result = await fetchWithRedirects(`${BASE_URL}/me/top/tracks`, 'GET');

  if (!result) throw new Error('Failed to fetch top user tracks from Spotify API');

  return isTopTracks(result) ? result.items : [];
};

export const useSearchTracksQuery = (
  searchedText: string,
  options?: Partial<UseQueryOptions<TrackType[]>>
): UseQueryResult<TrackType[], Error> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [TRACKS_QUERY, searchedText],
    queryFn: async () => {
      try {
        return await getTracks(searchedText);
      } catch {
        setAlertProps({ text: 'Something went wrong with searched tracks :(', position: 'top', type: 'error' });
        return [];
      }
    },
    ...options,
  });
};

export const useRecommendationTracksQuery = (
  options?: Partial<UseQueryOptions<TrackType[]>>
): UseQueryResult<TrackType[], Error> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [RECOMMENDATIONS_QUERY],
    queryFn: async () => {
      try {
        return await getRecommendationTracks();
      } catch {
        setAlertProps({ type: 'error', text: 'Something went wrong with recommendation tracks :(', position: 'top' });
        return [];
      }
    },
    ...options,
  });
};

export const useAlbumTracksQuery = (id: string): UseQueryResult<TrackType[] | null, Error> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [ALBUM_TRACKS_QUERY, id],
    queryFn: async () => {
      try {
        return await getAlbumTracks(id);
      } catch {
        setAlertProps({ text: 'Something went wrong with album tracks :(', type: 'error', position: 'top' });
        return [];
      }
    },
  });
};

export const useArtistTopTracksQuery = (id: string): UseQueryResult<TrackType[], Error> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [TOP_TRACKS_QUERY, id],
    queryFn: async () => {
      try {
        return await getArtistTopTracks(id);
      } catch {
        setAlertProps({ type: 'error', position: 'top', text: 'Something went wrong with artist top tracks :(' });
        return [];
      }
    },
  });
};

export const useTopUserTracksQuery = (
  options?: Partial<UseQueryOptions<TrackType[]>>
): UseQueryResult<TrackType[], Error> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [TOP_USER_TRACKS_QUERY],
    queryFn: async () => {
      try {
        return await getTopUserTracks();
      } catch {
        setAlertProps({ type: 'error', position: 'top', text: 'Something went wrong with top user tracks :(' });
        return [];
      }
    },
    ...options,
  });
};
