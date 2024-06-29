import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TrackType } from "src/types/types";
import { Track } from "../Track";
import { Navbar } from "react-bootstrap";
import SpotifyPlayer from "react-spotify-web-playback";
import { useSearchTracksQuery } from "src/api/searchData";

export const TracksList = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const searchedText = searchParams.get("query") ?? "";

  const { data: tracks } = useSearchTracksQuery(searchedText);
  const [currentTrack, setCurrentTrack] = useState<TrackType | null>(null);

  const token = localStorage.getItem("spotify_token");

  return (
    <>
      <div className="track-list">
        {tracks?.map((track, index) => (
          <Track
            track={track}
            key={`${track.name}-track-${index}`}
            setCurrentTrack={() => setCurrentTrack(track)}
          />
        ))}
      </div>

      {!!currentTrack && (
        <Navbar
          className="bg-body-tertiary justify-content-center"
          bg="dark"
          data-bs-theme="dark"
          sticky="bottom"
        >
          <SpotifyPlayer
            token={token ?? ""}
            uris={[currentTrack.uri]}
            styles={{
              activeColor: "#fff",
              bgColor: "#333",
              color: "#fff",
              loaderColor: "#fff",
              sliderColor: "#1cb954",
              trackArtistColor: "#ccc",
              trackNameColor: "#fff",
            }}
            autoPlay={true}
          />
          ;
        </Navbar>
      )}
    </>
  );
};
