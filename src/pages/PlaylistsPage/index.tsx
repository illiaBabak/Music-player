import { createContext, useContext, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Header } from 'src/components/Header';
import { PlayListsList } from 'src/components/PlayListsList';
import { PlayListTracks } from 'src/components/PlayListTracks';
import { SideBarMenu } from 'src/components/SideBarMenu';
import { GlobalContext } from 'src/root';
import { Player } from 'src/components/Player';
import { DeletePlaylistWindow } from 'src/components/DeletePlaylistWindow';

type PlaylistContextType = {
  disabledPlaylists: string[];
};

export const PlaylistContext = createContext<PlaylistContextType>({
  disabledPlaylists: [],
});

export const PlaylistsPage = (): JSX.Element => {
  const location = useLocation();
  const { currentUriTrack } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();

  const [shouldShowModal, setShouldShowModal] = useState(false);

  const currentPlaylistId = searchParams.get('playlist-id') ?? '';

  const isRecommendedRoute = location.pathname.endsWith('recommended');

  const [disabledPlaylists, setDisabledPlaylists] = useState<string[]>([]);

  const disablePlaylist = (playlistId: string) => {
    setDisabledPlaylists((prev) => [...prev, playlistId]);

    setTimeout(() => {
      setDisabledPlaylists((prev) => prev.filter((id) => id !== playlistId));
    }, 45000);
  };

  return (
    <PlaylistContext.Provider value={{ disabledPlaylists }}>
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
                disablePlaylist={disablePlaylist}
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
    </PlaylistContext.Provider>
  );
};
