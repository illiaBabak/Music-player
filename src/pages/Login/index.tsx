import { Container } from 'react-bootstrap';
import { API_URL, CLIENT_ID, REDIRECT_URL, SCOPES } from 'src/utils/constants';

export const LoginPage = (): JSX.Element => {
  const handleClick = () => {
    const authUrl = `${API_URL}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URL)}&scope=${encodeURIComponent(SCOPES.join(' '))}&response_type=token&show_dialog=true`;

    window.location.href = authUrl;
  };

  return (
    <Container className='text-center d-flex flex-column align-items-center login-container'>
      <img
        src='https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_White.png'
        alt='spotify logo'
        className='spotify-logo'
      />
      <button className='btn mt-4 p-2 login-btn text-white' onClick={handleClick}>
        Login with Spotify
      </button>
    </Container>
  );
};
