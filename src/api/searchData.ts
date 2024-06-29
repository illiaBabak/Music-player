import { TrackType } from "src/types/types";
import { isTrackResponse } from "src/utils/guards";

export const searchData = async (
  endpoint: string,
  token: string
): Promise<TrackType[]> => {
  const req = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!req.ok) {
    throw new Error("Failed to fetch data from Spotify API");
  }

  const response: unknown = await req.json();
  return isTrackResponse(response) ? response.tracks.items : [];
};
