import { useContext } from 'react';
import { Navbar } from 'react-bootstrap';
import SpotifyPlayer from 'react-spotify-web-playback';
import { GlobalContext } from 'src/root';

export const Player = (): JSX.Element => {
  const { isLightTheme, currentUriTrack } = useContext(GlobalContext);

  const token = localStorage.getItem('spotify_token');

  return (
    <Navbar className={`justify-content-center nav-player p-0`} data-bs-theme='dark' fixed='bottom'>
      <SpotifyPlayer
        key={`${isLightTheme ? 'player-light-theme' : 'player-dark-theme'}-${currentUriTrack}`}
        token={token ?? ''}
        uris={[currentUriTrack ?? '']}
        styles={{
          activeColor: '#fff',
          bgColor: `${isLightTheme ? '#ff8300' : '#130821'}`,
          color: `${isLightTheme ? '#ffffff' : '#433673'}`,
          loaderColor: '#fff',
          sliderColor: `${isLightTheme ? '#ffffff' : '#433673'}`,
          trackArtistColor: '#ccc',
          trackNameColor: '#fff',
        }}
        autoPlay={true}
      />
    </Navbar>
  );
};
