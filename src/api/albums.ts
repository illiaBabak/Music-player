import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AlbumType } from "src/types/types";
import { isAlbumResponse } from "src/utils/guards";
import { ALBUMS_QUERY } from "./constants";

const getAlbums = async (searchedText: string): Promise<AlbumType[]> => {
  const token = localStorage.getItem("spotify_token");

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchedText)}&type=album`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch albums from Spotify API");

  const responseJson: unknown = await response.json();

  return isAlbumResponse(responseJson) ? responseJson.albums.items : [];
};

export const useSearchAlbumsQuery = (
  searchedText: string
): UseQueryResult<AlbumType[], Error> =>
  useQuery({
    queryKey: [ALBUMS_QUERY, searchedText],
    queryFn: async () => {
      return await getAlbums(searchedText);
    },
  });
