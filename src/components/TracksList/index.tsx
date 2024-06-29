import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TrackType } from "src/types/types";
import { Track } from "../Track";
import { Navbar } from "react-bootstrap";
import { searchData } from "src/api/searchData";
import SpotifyPlayer from "react-spotify-web-playback";

export const TracksList = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const searchedText = searchParams.get("query") ?? "";

  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [currentTrack, setCurrentTrack] = useState<TrackType | null>(null);
  const token = localStorage.getItem("spotify_token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !searchedText) return;

      const data = await searchData(
        `search?q=${encodeURIComponent(searchedText)}&type=track`,
        token
      );
      setTracks(data);
    };

    fetchData();
  }, [token, searchedText]);

  return (
    <>
      <div className="track-list">
        {tracks.map((track, index) => (
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
