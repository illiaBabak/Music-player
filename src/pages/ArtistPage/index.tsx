import { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useArtistAlbumsQuery, useArtistQuery, useRelatedArtistsQuery } from 'src/api/artists';
import { useArtistTopTracksQuery } from 'src/api/tracks';
import { AlbumsList } from 'src/components/AlbumsList';
import { ArtistsList } from 'src/components/ArtistsList';
import { FollowArtistBtn } from 'src/components/FollowArtistBtn';
import { Player } from 'src/components/Player';
import { SideBarMenu } from 'src/components/SideBarMenu';
import { ThemeBtn } from 'src/components/ThemeBtn';
import { TracksList } from 'src/components/TracksList';
import { GlobalContext } from 'src/root';
import { numToWords } from 'src/utils/numToWords';

export const ArtistPage = (): JSX.Element => {
  const { currentUriTrack } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedArtistId = searchParams.get('artist-id') ?? '';

  const { data: artist } = useArtistQuery(selectedArtistId);

  const { data: relatedArtists, isLoading: isLoadingRelatedArtists } = useRelatedArtistsQuery(selectedArtistId);

  const { data: artistAlbums, isLoading: isLoadingArtistsAlbums } = useArtistAlbumsQuery(selectedArtistId);

  const { data: artistTopTracks, isLoading: isLoadingArtistsTopTracks } = useArtistTopTracksQuery(selectedArtistId);

  const artistSectionClassName = 'white-text m-4 mt-4';

  return (
    <Container className='d-flex flex-nowrap artist-container p-0 m-0 '>
      <Row className='row-artist w-100 flex-nowrap'>
        <SideBarMenu />
        <Col className={`col-content m-0 p-0 scroll-container ${currentUriTrack ? 'playing' : ''}`}>
          <div className='artist-header d-flex flex-row justify-content-between align-items-center p-3 w-100'>
            <div
              className='return-btn p-3 m-0 d-flex justify-content-between align-items-center text-white'
              onClick={() => navigate('/home')}
            >
              <span className='fs-1'>&lt;</span>
              Back
            </div>
            <ThemeBtn />
          </div>

          <div className='artist-info d-flex flex-row m-2'>
            <img
              src={artist?.images.length ? artist.images[0].url : '/src/images/not-found.jpg'}
              className='artist-icon rounded-circle object-fit-cover'
            />

            <div className='details d-flex flex-column m-3 position-relative w-100'>
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
              <span className='fs-6 mt-1'>Followers: {numToWords(artist?.followers.total ?? 0)}</span>

              {artist && <FollowArtistBtn artist={artist} />}
            </div>
          </div>

          <div className={artistSectionClassName}>
            <h4>Artist's top tracks</h4>
            {!isLoadingArtistsTopTracks && !artistTopTracks?.length ? (
              <div className='empty-data d-flex flex-column justify-content-start align-items-center w-100 h-25'>
                <img className='empty-icon object-fit-contain' src='/src/images/no-data.png' alt='empty' />
                <p className='fs-6 m-1'>Oops, not found anything</p>
              </div>
            ) : (
              <TracksList tracks={artistTopTracks ?? []} isLine={true} isLoading={isLoadingArtistsTopTracks} />
            )}
          </div>

          <div className={artistSectionClassName}>
            <h4>Artist's albums</h4>
            <AlbumsList albums={artistAlbums ?? []} isLine={true} isLoading={isLoadingArtistsAlbums} />
          </div>

          <div className={artistSectionClassName}>
            <h4>Related artists</h4>
            {!isLoadingRelatedArtists && !relatedArtists?.length ? (
              <div className='empty-data d-flex flex-column justify-content-start align-items-center w-100 h-25'>
                <img className='empty-icon' src='/src/images/no-data.png' alt='empty' />
                <p className='fs-6 m-1'>Oops, not found anything</p>
              </div>
            ) : (
              <ArtistsList artists={relatedArtists ?? []} isLine={true} isLoading={isLoadingRelatedArtists} />
            )}
          </div>
        </Col>

        {!!currentUriTrack && <Player />}
      </Row>
    </Container>
  );
};
