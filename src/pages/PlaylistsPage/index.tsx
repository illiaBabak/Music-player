import { useContext, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Header } from 'src/components/Header';
import { PlayListsList } from 'src/components/PlayListsList';
import { PlayListTracks } from 'src/pages/PlaylistsPage/components/PlayListTracks';
import { SideBarMenu } from 'src/components/SideBarMenu';
import { GlobalContext } from 'src/root';
import { Player } from 'src/components/Player';
import { DeletePlaylistWindow } from 'src/pages/PlaylistsPage/components/DeletePlaylistWindow';
import { ModalWrapper } from 'src/components/ModalWrapper';
import { ImageEditor } from 'src/pages/PlaylistsPage/components/ImageEditor';

export const PlaylistsPage = (): JSX.Element => {
  const { currentUriTrack, imageToEdit, setImageToEdit } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();
  const location = useLocation();

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

        {!!imageToEdit && (
          <ModalWrapper onClose={() => setImageToEdit(null)}>
            <ImageEditor
              imageToEdit={imageToEdit ?? ''}
              playlistId={currentPlaylistId}
              onClose={() => setImageToEdit(null)}
            />
          </ModalWrapper>
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
