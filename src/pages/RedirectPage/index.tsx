import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedBg } from 'src/components/AnimatedBg';
import { GlobalContext } from 'src/root';

export const RedirectPage = (): JSX.Element => {
  const { isMobile } = useContext(GlobalContext);
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
    <div className='redirect-page d-flex justify-content-center align-items-center h-100 overflow-hidden text-center'>
      <div className='d-flex flex-column text-white justify-content-center align-items-center content p-1'>
        <span className={`${isMobile ? 'fs-4' : 'fs-2'}`}>Ooops..Something went wrong :(</span>
        <button
          className='btn d-flex mt-4 p-2 redirect-btn border-0 text-white d-flex align-items-center justify-content-center'
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
