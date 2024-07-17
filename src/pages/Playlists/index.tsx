import { useContext } from 'react';
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { Header } from 'src/components/Header';
import { PlayListsList } from 'src/components/PlayListsList';
import { PlayListTracks } from 'src/components/PlayListTracks';
import { SideBarMenu } from 'src/components/SideBarMenu';
import { GlobalContext } from 'src/root';
import SpotifyPlayer from 'react-spotify-web-playback';

export const PlaylistsPage = (): JSX.Element => {
  const { currentTrack, isLightTheme } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();
  const currentPlaylistId = searchParams.get('playlist-id') ?? '';

  const token = localStorage.getItem('spotify_token');

  return (
    <Container className='d-flex playlists-container p-0 m-0'>
      <Row className='row-playlists'>
        <SideBarMenu />
        <Col className='col-content m-0 p-0'>
          {currentPlaylistId ? (
            <PlayListTracks playlistId={currentPlaylistId} />
          ) : (
            <>
              <Header />
              <PlayListsList />
            </>
          )}
        </Col>

        {!!currentTrack && (
          <Navbar className={`justify-content-center nav-player`} data-bs-theme='dark' fixed='bottom'>
            <SpotifyPlayer
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
        )}
      </Row>
    </Container>
  );
};
