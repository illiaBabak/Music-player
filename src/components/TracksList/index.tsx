import { useSearchParams } from "react-router-dom";
import { Track } from "../Track";

import { useSearchTracksQuery } from "src/api/searchData";
import { useContext } from "react";
import { GlobalContext } from "src/root";

export const TracksList = (): JSX.Element => {
  const { isLightTheme } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();
  const searchedText = searchParams.get("query") ?? "";

  const { data: tracks } = useSearchTracksQuery(searchedText);

  return (
    <div className={`track-list ${isLightTheme ? "light" : "dark"}`}>
      {tracks?.map((track, index) => (
        <Track track={track} key={`${track.name}-track-${index}`} />
      ))}
    </div>
  );
};
