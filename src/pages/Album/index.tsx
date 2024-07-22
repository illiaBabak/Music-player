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

export const AlbumPage = (): JSX.Element => {
  const { currentUriTrack } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedAlbumId = searchParams.get('album-id') ?? '';

  const { data: selectedAlbum } = useAlbumQuery(selectedAlbumId);

  const { data: albumTracks } = useAlbumTracksQuery(selectedAlbumId);

  const { data: artist } = useArtistQuery(selectedAlbum?.artists[0].id ?? '', { enabled: !!selectedAlbum });

  return (
    <Container className='d-flex flex-nowrap album-container p-0 m-0'>
      <Row className='row-album w-100 flex-nowrap'>
        <SideBarMenu />
        <Col className='col-content m-0 p-0'>
          <div className='album-header d-flex flex-row justify-content-between align-items-center p-3 w-100'>
            <div
              className='return-btn p-3 m-0 d-flex justify-content-center align-items-center'
              onClick={() => navigate('/home')}
            >
              Back
            </div>
            <ThemeBtn />
          </div>
          <div className='album-info w-100 m-2 p-3 d-flex justify-content-start align-items-center'>
            <img src={selectedAlbum?.images[0].url ?? ''} className='album-icon' />
            <div className='details d-flex flex-column ms-2'>
              <div className='fs-2'>{selectedAlbum?.name}</div>
              <span className='fs-6 mt-1'>Tracks: {selectedAlbum?.total_tracks}</span>
              <span className='fs-6 mt-1'>Release date: {selectedAlbum?.release_date}</span>
              <div
                className='artist-info d-flex flex-row justify-content-start align-items-center mt-1'
                onClick={() => navigate(`/artist?artist-id=${artist?.id}`)}
              >
                <img className='artist-icon' src={artist?.images[0].url} />
                <span className='fs-6 m-1'>{artist?.name}</span>
              </div>
            </div>
          </div>
          <TracksList readyTracks={albumTracks ?? []} />
        </Col>

        {!!currentUriTrack && <Player currentUriTrack={currentUriTrack} />}
      </Row>
    </Container>
  );
};