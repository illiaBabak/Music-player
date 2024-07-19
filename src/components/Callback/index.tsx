import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Callback = (): JSX.Element => {
  const navigate = useNavigate();

  useEffect(() => {
    const { hash } = window.location;

    if (!hash) return;

    const token = new URLSearchParams(hash.substring(1)).get('access_token');

    if (!token) return;

    localStorage.setItem('spotify_token', token);

    navigate('/home?section=All');
  }, [navigate]);

  return <div>Loading...</div>;
};
