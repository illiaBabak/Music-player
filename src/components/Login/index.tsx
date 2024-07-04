import { Container } from "react-bootstrap";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URL = "http://localhost:3000/callback";
const API_URL = "https://accounts.spotify.com/authorize";
const SCOPES = [
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

export const Login = (): JSX.Element => {
  const handleClick = () => {
    const authUrl = `${API_URL}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URL)}&scope=${encodeURIComponent(SCOPES.join(" "))}&response_type=token&show_dialog=true`;

    window.location.href = authUrl;
  };

  return (
    <Container className="text-center mt-5 d-flex flex-column align-items-center login-container">
      <img
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_White.png"
        alt="spotify logo"
        style={{ maxWidth: "300px" }}
      />
      <button className="btn mt-4 p-2 login-btn" onClick={handleClick}>
        Login with Spotify
      </button>
    </Container>
  );
};
