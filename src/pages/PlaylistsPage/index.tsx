import { useContext, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Header } from 'src/components/Header';
import { PlayListsList } from 'src/components/PlayListsList';
import { PlayListTracks } from 'src/components/PlayListTracks';
import { SideBarMenu } from 'src/components/SideBarMenu';
import { GlobalContext } from 'src/root';
import { Player } from 'src/components/Player';
import { DeletePlaylistWindow } from 'src/components/DeletePlaylistWindow';

export const PlaylistsPage = (): JSX.Element => {
  const location = useLocation();
  const { currentUriTrack } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();

  const [shouldShowModal, setShouldShowModal] = useState(false);

  const currentPlaylistId = searchParams.get('playlist-id') ?? '';

  const isRecommendedRoute = location.pathname.endsWith('recommended');

  return (
    <Container className='d-flex playlists-container p-0 m-0 flex-nowrap'>
      <Row className='row-playlists w-100 flex-nowrap'>
        <SideBarMenu />

        {shouldShowModal && (
          <DeletePlaylistWindow onClose={() => setShouldShowModal(false)} playlistId={currentPlaylistId} />
        )}

        <Col className={`col-content m-0 p-0 scroll-container ${currentUriTrack ? 'playing' : ''}`}>
          {currentPlaylistId ? (
            <PlayListTracks
              playlistId={currentPlaylistId}
              isOwnPlaylist={!isRecommendedRoute}
              showDeleteWindow={() => setShouldShowModal(true)}
            />
          ) : (
            <>
              <Header />
              <PlayListsList showRecommendations={isRecommendedRoute} />
            </>
          )}
        </Col>

        {!!currentUriTrack && <Player />}
      </Row>
    </Container>
  );
};
