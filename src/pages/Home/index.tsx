import { useContext } from 'react';
import { Col, Container, Navbar, Row } from 'react-bootstrap';
import { Header } from 'src/components/Header';
import { SideBarMenu } from 'src/components/SideBarMenu';
import { TracksList } from 'src/components/TracksList';
import { GlobalContext } from 'src/root';
import SpotifyPlayer from 'react-spotify-web-playback';
import { Chips } from 'src/components/Chips';
import { ArtistsList } from 'src/components/ArtistsList';
import { AlbumsList } from 'src/components/AlbumsList';

export const HomePage = (): JSX.Element => {
  const { currentTrack, isLightTheme, selectedChip } = useContext(GlobalContext);

  const token = localStorage.getItem('spotify_token');

  const sectionClassName = `m-2 p-3 title-${isLightTheme ? 'light' : 'dark'}`;

  return (
    <Container className='d-flex home-container p-0 m-0'>
      <Row className='row-home'>
        <SideBarMenu />
        <Col className='col-content m-0 p-0'>
          <Header />
          <Chips />
          {selectedChip === 'All' && (
            <>
              <h4 className={sectionClassName}>Tracks</h4>
              <TracksList />

              <h4 className={sectionClassName}>Artists</h4>
              <ArtistsList />

              <h4 className={sectionClassName}>Albums</h4>
              <AlbumsList />
            </>
          )}
          {selectedChip === 'Tracks' && <TracksList />}
          {selectedChip === 'Artists' && <ArtistsList />}
          {selectedChip === 'Albums' && <AlbumsList />}
        </Col>

        {!!currentTrack && (
          <Navbar
            className={`justify-content-center ${isLightTheme ? 'light' : 'dark'} nav-player`}
            data-bs-theme='dark'
            fixed='bottom'
          >
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
        )}
      </Row>
    </Container>
  );
};
