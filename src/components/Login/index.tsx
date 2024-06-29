import React from "react";
import { Container } from "react-bootstrap";

export const Login = (): JSX.Element => {
  const handleClick = () => {
    const clientId = import.meta.env.VITE_CLIENT_ID;
    const redirectUrl = "http://localhost:3000/callback";
    const apiUrl = "https://accounts.spotify.com/authorize";
    const scopes = [
      "user-read-email",
      "user-read-private",
      "user-modify-playback-state",
      "user-read-playback-state",
      "user-read-currently-playing",
      "user-read-recently-played",
      "user-read-playback-position",
      "user-top-read",
      "playlist-read-private",
      "streaming",
    ];

    const authUrl = `${apiUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=${encodeURIComponent(scopes.join(" "))}&response_type=token&show_dialog=true`;

    window.location.href = authUrl;
  };

  return (
    <Container className="text-center mt-5">
      <img
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_White.png"
        alt="spotify logo"
        style={{ maxWidth: "300px" }}
      />
      <button className="btn btn-success mt-3" onClick={handleClick}>
        Login with Spotify
      </button>
    </Container>
  );
};
