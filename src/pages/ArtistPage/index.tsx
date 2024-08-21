import { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useArtistAlbumsQuery, useArtistQuery, useRelatedArtistsQuery } from 'src/api/artists';
import { useArtistTopTracksQuery } from 'src/api/tracks';
import { AlbumsList } from 'src/components/AlbumsList';
import { ArtistsList } from 'src/components/ArtistsList';
import { Player } from 'src/components/Player';
import { SideBarMenu } from 'src/components/SideBarMenu';
import { ThemeBtn } from 'src/components/ThemeBtn';
import { TracksList } from 'src/components/TracksList';
import { GlobalContext } from 'src/root';

export const ArtistPage = (): JSX.Element => {
  const { currentUriTrack } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedArtistId = searchParams.get('artist-id') ?? '';

  const { data: artist } = useArtistQuery(selectedArtistId);

  const { data: relatedArtists, isFetching: isFetchingRelatedArtists } = useRelatedArtistsQuery(selectedArtistId);

  const { data: artistAlbums, isFetching: isFetchingArtistsAlbums } = useArtistAlbumsQuery(selectedArtistId);

  const { data: artistTopTracks, isFetching: isFetchingArtistsTopTracks } = useArtistTopTracksQuery(selectedArtistId);

  const artistSectionClassName = 'white-text m-4 mt-4';

  return (
    <Container className='d-flex flex-nowrap artist-container p-0 m-0 '>
      <Row className='row-artist w-100 flex-nowrap'>
        <SideBarMenu />
        <Col className='col-content m-0 p-0 scroll-container'>
          <div className='artist-header d-flex flex-row justify-content-between align-items-center p-3 w-100'>
            <div
              className='return-btn p-3 m-0 d-flex justify-content-center align-items-center'
              onClick={() => navigate('/home')}
            >
              Back
            </div>
            <ThemeBtn />
          </div>

          <div className='artist-info d-flex flex-row m-2'>
            <img src={artist?.images[0].url ?? ''} className='artist-icon' />

            <div className='details d-flex flex-column m-3'>
              <span className='fs-2'>{artist?.name}</span>
              <div className='fs-5 mt-2'>
                Genres:
                {artist?.genres.map((genre, index) => (
                  <span className='fs-6 ms-2' key={genre}>
                    {genre}
                    {artist.genres.length - 1 === index ? '' : ','}
                  </span>
                ))}
              </div>
              <span className='fs-6 mt-1'>Followers: {artist?.followers.total}</span>
            </div>
          </div>

          <div className={artistSectionClassName}>
            <h4>Artist's top tracks</h4>
            <TracksList tracks={artistTopTracks ?? []} isLine={true} isLoading={isFetchingArtistsTopTracks} />
          </div>

          <div className={artistSectionClassName}>
            <h4>Artist's albums</h4>
            <AlbumsList albums={artistAlbums ?? []} isLine={true} isLoading={isFetchingArtistsAlbums} />
          </div>

          <div className={artistSectionClassName}>
            <h4>Related artists</h4>
            <ArtistsList artists={relatedArtists ?? []} isLine={true} isLoading={isFetchingRelatedArtists} />
          </div>
        </Col>

        {!!currentUriTrack && <Player />}
      </Row>
    </Container>
  );
};
