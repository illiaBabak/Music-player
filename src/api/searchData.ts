import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { TrackType } from "src/types/types";
import { isTrackResponse } from "src/utils/guards";
import { TRACKS_QUERY } from "./constants";

const getTracks = async (searchedText: string): Promise<TrackType[]> => {
  const token = localStorage.getItem("spotify_token");

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchedText)}&type=track`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch data from Spotify API");

  const responseJson: unknown = await response.json();

  return isTrackResponse(responseJson) ? responseJson.tracks.items : [];
};

export const useSearchTracksQuery = (
  searchedText: string
): UseQueryResult<TrackType[], Error> =>
  useQuery({
    queryKey: [TRACKS_QUERY, searchedText],
    queryFn: async () => {
      return await getTracks(searchedText);
    },
  });
