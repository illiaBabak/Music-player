import { usePlaylists } from "src/api/playlists";
import { PlayList } from "../PlayList";
import { useContext } from "react";
import { GlobalContext } from "src/root";
import { useSearchParams } from "react-router-dom";
import { PlaylistType } from "src/types/types";

const isPlaylistContainsText = (playlist: PlaylistType, text: string) =>
  playlist.name.toLocaleLowerCase().includes(text.toLocaleLowerCase());

export const PlayListsList = (): JSX.Element => {
  const { isLightTheme } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();
  const searchedText = searchParams.get("query") ?? "";

  const { data: playlists } = usePlaylists();

  const filteredPlaylists = searchedText
    ? playlists?.filter((playlist) =>
        isPlaylistContainsText(playlist, searchedText)
      )
    : playlists;

  return (
    <div className={`playlists-list ${isLightTheme ? "light" : "dark"}`}>
      {filteredPlaylists?.map((playlist, index) => (
        <PlayList key={`${playlist.id}-${index}`} playlist={playlist} />
      ))}
    </div>
  );
};
