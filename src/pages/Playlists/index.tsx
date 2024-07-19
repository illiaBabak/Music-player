import { useContext } from 'react';
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { Header } from 'src/components/Header';
import { PlayListsList } from 'src/components/PlayListsList';
import { PlayListTracks } from 'src/components/PlayListTracks';
import { SideBarMenu } from 'src/components/SideBarMenu';
import { GlobalContext } from 'src/root';
import { Player } from 'src/components/Player';

export const PlaylistsPage = (): JSX.Element => {
  const { currentUriTrack } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();

  const currentPlaylistId = searchParams.get('playlist-id') ?? '';

  return (
    <Container className='d-flex playlists-container p-0 m-0 flex-nowrap'>
      <Row className='row-playlists w-100 flex-nowrap'>
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

        {!!currentUriTrack && <Player currentUriTrack={currentUriTrack} />}
      </Row>
    </Container>
  );
};
