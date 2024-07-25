import { Container } from 'react-bootstrap';
import { AnimatedBg } from 'src/components/AnimatedBg';
import { API_URL, CLIENT_ID, REDIRECT_URL, SCOPES } from 'src/utils/constants';

export const LoginPage = (): JSX.Element => {
  const handleClick = () => {
    const authUrl = `${API_URL}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URL)}&scope=${encodeURIComponent(SCOPES.join(' '))}&response_type=token&show_dialog=true`;

    window.location.href = authUrl;
  };

  return (
    <Container className='text-center text-white d-flex flex-column align-items-center login-container m-0 p-0'>
      <div className='login-content mt-4 d-flex flex-column align-items-center justify-content-center'>
        <img src='src/images/logo.png' alt='logo' className='logo' />
        <h2 className='mt-4'>Welcome!</h2>
        <p className='logo-text'>To use our service, please log in with your Spotify account</p>
        <button
          className='btn mt-4 p-2 login-btn text-white d-flex align-items-center justify-content-center'
          onClick={handleClick}
        >
          <span className='btn-text d-flex align-items-center justify-content-center'>Click to login</span>
        </button>
      </div>

      <AnimatedBg />
    </Container>
  );
};
