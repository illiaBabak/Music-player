import { useContext, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { PlayListTracks } from 'src/pages/PlaylistPage/components/PlayListTracks';
import { SideBarMenu } from 'src/components/SideBarMenu';
import { GlobalContext } from 'src/root';
import { Player } from 'src/components/Player';
import { DeletePlaylistWindow } from 'src/pages/PlaylistPage/components/DeletePlaylistWindow';
import { ModalWrapper } from 'src/components/ModalWrapper';
import { ImageEditor } from 'src/pages/PlaylistPage/components/ImageEditor';

type Props = {
  isRecommendedRoute: boolean;
};

export const PlaylistPage = ({ isRecommendedRoute }: Props): JSX.Element => {
  const { currentUriTrack, imageToEdit, setImageToEdit } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();

  const [shouldShowModal, setShouldShowModal] = useState(false);

  const currentPlaylistId = searchParams.get('playlist-id') ?? '';

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
          <PlayListTracks
            playlistId={currentPlaylistId}
            isOwnPlaylist={!isRecommendedRoute}
            showDeleteWindow={() => setShouldShowModal(true)}
          />
        </Col>

        {!!currentUriTrack && <Player />}
      </Row>
    </Container>
  );
};
