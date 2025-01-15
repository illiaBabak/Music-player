import { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAlbumQuery } from 'src/api/albums';
import { useArtistQuery } from 'src/api/artists';
import { useAlbumTracksQuery } from 'src/api/tracks';
import { Player } from 'src/components/Player';
import { SideBarMenu } from 'src/components/SideBarMenu';
import { ThemeBtn } from 'src/components/ThemeBtn';
import { TracksList } from 'src/components/TracksList';
import { GlobalContext } from 'src/root';
import { formatDate } from 'src/utils/formatDate';

export const AlbumPage = (): JSX.Element => {
  const { currentUriTrack, isTablet, isMobile } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedAlbumId = searchParams.get('album-id') ?? '';

  const { data: selectedAlbum } = useAlbumQuery(selectedAlbumId);

  const { data: albumTracks, isLoading: isLoadingAlbumTracks } =
    useAlbumTracksQuery(selectedAlbumId);

  const { data: artist } = useArtistQuery(selectedAlbum?.artists[0].id ?? '', {
    enabled: !!selectedAlbum,
  });

  return (
    <Container className='d-flex flex-nowrap album-container p-0 m-0'>
      <Row className='row-album w-100 flex-nowrap p-0 m-0'>
        <SideBarMenu />
        <Col
          className={`col-content m-0 p-0 scroll-container ${currentUriTrack ? 'playing' : ''}`}
        >
          <div
            className={`album-header d-flex flex-row justify-content-between align-items-center ${isMobile ? 'p-2' : 'p-3'} w-100 text-white`}
          >
            <div
              className={`return-btn ${isMobile ? 'p-2' : 'p-3'} m-0 d-flex justify-content-between align-items-center text-white`}
              onClick={() => navigate('/home')}
            >
              <span className={`${isMobile ? 'fs-5' : 'fs-1'}`}>&lt;</span> Back
            </div>
            <ThemeBtn />
          </div>

          <div
            className={`album-info w-100 d-flex  ${isMobile ? 'p-1 m-0 flex-column justify-content-center align-items-center text-center' : 'p-3 flex-row justify-content-start align-items-start m-2'}`}
          >
            <img
              src={selectedAlbum?.images[0].url ?? '/not-found.jpg'}
              className='album-icon'
            />
            <div className='details d-flex flex-column ms-2 w-100'>
              <div
                className={`${isMobile ? 'fs-6 mt-2' : isTablet ? 'fs-4' : 'fs-2'} w-100`}
              >
                {selectedAlbum?.name}
              </div>
              <span className='fs-6 mt-2'>
                Tracks: {selectedAlbum?.total_tracks}
              </span>
              <span className='fs-6 mt-2'>
                Release date: {formatDate(selectedAlbum?.release_date ?? '')}
              </span>
              <div
                className={`artist-info d-flex flex-row align-items-center ${isMobile ? 'mt-1 justify-content-center' : 'mt-3 justify-content-start'}`}
                onClick={() => navigate(`/artist?artist-id=${artist?.id}`)}
              >
                <img
                  className='artist-icon rounded-circle object-fit-cover'
                  src={artist?.images[0].url}
                />
                <span className={`${isMobile ? 'fs-6 m-0 ms-1' : 'fs-5 m-2'}`}>
                  {artist?.name}
                </span>
              </div>
            </div>
          </div>

          <TracksList
            tracks={albumTracks ?? []}
            isLine={false}
            isLoading={isLoadingAlbumTracks}
          />
        </Col>

        {!!currentUriTrack && <Player />}
      </Row>
    </Container>
  );
};
