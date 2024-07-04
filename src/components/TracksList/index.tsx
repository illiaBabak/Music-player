import { useSearchParams } from "react-router-dom";
import { Track } from "../Track";

import { useSearchTracksQuery } from "src/api/searchData";

export const TracksList = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const searchedText = searchParams.get("query") ?? "";

  const { data: tracks } = useSearchTracksQuery(searchedText);

  return (
    <div className="track-list">
      {tracks?.map((track, index) => (
        <Track track={track} key={`${track.name}-track-${index}`} />
      ))}
    </div>
  );
};
