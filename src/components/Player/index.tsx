import { useContext } from 'react';
import { Navbar } from 'react-bootstrap';
import SpotifyPlayer from 'react-spotify-web-playback';
import { GlobalContext } from 'src/root';
import { TrackType } from 'src/types/types';

type Props = {
  currentTrack: TrackType;
};

export const Player = ({ currentTrack }: Props): JSX.Element => {
  const { isLightTheme } = useContext(GlobalContext);

  const token = localStorage.getItem('spotify_token');

  return (
    <Navbar className={`justify-content-center nav-player`} data-bs-theme='dark' fixed='bottom'>
      <SpotifyPlayer
        key={isLightTheme ? 'player-light-theme' : 'player-dark-theme'}
        token={token ?? ''}
        uris={[currentTrack.uri]}
        styles={{
          activeColor: '#fff',
          bgColor: `${isLightTheme ? '#3b3d3f' : '#040b1b'}`,
          color: `${isLightTheme ? '#56585d' : '#192a56'}`,
          loaderColor: '#fff',
          sliderColor: `${isLightTheme ? '#aaaaaa' : '#273c75'}`,
          trackArtistColor: '#ccc',
          trackNameColor: '#fff',
        }}
        autoPlay={true}
      />
    </Navbar>
  );
};
