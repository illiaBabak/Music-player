import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedBg } from 'src/components/AnimatedBg';

export const RedirectPage = (): JSX.Element => {
  const navigate = useNavigate();

  useEffect(() => {
    const { hash } = window.location;

    if (!hash) return;

    const token = new URLSearchParams(hash.substring(1)).get('access_token');

    if (!token) return;

    localStorage.setItem('spotify_token', token);

    navigate('/home');
  }, [navigate]);

  return (
    <div className='redirect-page d-flex justify-content-center align-items-center h-100'>
      <div className='d-flex flex-column text-white justify-content-center align-items-center content'>
        <span className='fs-2'>Ooops..Something went wrong :(</span>
        <button
          className='btn d-flex mt-4 p-2 redirect-btn text-white d-flex align-items-center justify-content-center'
          onClick={() => navigate('/login')}
        >
          <span className='btn-text d-flex align-items-center justify-content-center w-100 h-100'>
            Return to login page
          </span>
        </button>
      </div>
      <AnimatedBg />
    </div>
  );
};
