import { useSearchParams } from "react-router-dom";
import { ThemeBtn } from "../ThemeBtn";
import { useContext } from "react";
import { GlobalContext } from "src/root";
import { usePlaylist, usePlaylistsItems } from "src/api/playlists";
import { TracksList } from "../TracksList";

type Props = {
  playlistId: string;
};

export const PlayListTracks = ({ playlistId }: Props): JSX.Element => {
  const { isLightTheme, setCurrentTrack } = useContext(GlobalContext);
  const [, setSearchParams] = useSearchParams();

  const { data: playlistItems } = usePlaylistsItems(playlistId);
  const { data: playlistData } = usePlaylist(playlistId);

  const tracks = playlistItems?.items.map((item) => item.track);

  return (
    <div className="playlist-tracks d-flex flex-column">
      <div className="header d-flex flex-row justify-content-between p-3">
        <div
          className={`return-btn p-3 m-0 ${isLightTheme ? "light" : "dark"}`}
          onClick={() => {
            setCurrentTrack(null);

            setSearchParams((prev) => {
              prev.delete("playlist-id");
              return prev;
            });
          }}
        >
          Back
        </div>
        <ThemeBtn />
      </div>

      <div className={`playlist-info p-2 ${isLightTheme ? "light" : "dark"}`}>
        <img
          src={
            playlistData?.images
              ? playlistData.images[0].url
              : "https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg"
          }
          className="playlist-icon"
        />
        <span className="fs-4 m-2">{playlistData?.name}</span>
      </div>
      <TracksList readyTracks={tracks} />
    </div>
  );
};
