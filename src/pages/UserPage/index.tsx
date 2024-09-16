import { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFollowedArtistsQuery, useTopUserArtistsQuery } from 'src/api/artists';
import { useTopUserTracksQuery } from 'src/api/tracks';
import { useUserQuery } from 'src/api/user';
import { ArtistsList } from 'src/components/ArtistsList';
import { Chips } from 'src/components/Chips';
import { SideBarMenu } from 'src/components/SideBarMenu';
import { ThemeBtn } from 'src/components/ThemeBtn';
import { TracksList } from 'src/components/TracksList';

export const UserPage = (): JSX.Element => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const selectedArtistSection = searchParams.get('section') ?? '';

  const isFollowed = selectedArtistSection === 'Followed';

  useEffect(() => {
    if (selectedArtistSection) return;

    setSearchParams((prev) => {
      prev.set('section', 'Top');
      return prev;
    });
  }, [setSearchParams, selectedArtistSection]);

  const { data: user } = useUserQuery();

  const { data: topUserArtists, isLoading: isLoadingArtists } = useTopUserArtistsQuery();

  const { data: topUserTracks, isLoading: isLoadingTracks } = useTopUserTracksQuery();

  const { data: followedArtists, isLoading: isLoadingFollowedArtists } = useFollowedArtistsQuery();

  const sectionClassName = 'd-flex flex-column justify-content-start flex-column w-100';

  return (
    <Container className='d-flex user-container p-0 m-0 flex-nowrap'>
      <Row className='row-user w-100 flex-nowrap'>
        <SideBarMenu />

        <Col className={`col-content m-0 p-0 scroll-container`}>
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

          <div className='user-details w-100 d-flex flex-column justify-content-center align-items-center p-2 m-2'>
            <img
              className='object-fit-contain user-icon rounded-circle'
              src={user?.images.length ? user.images[0].url : '/src/images/not-found.jpg'}
              alt='user-icon'
            />
            <p className='fs-4'>{user?.display_name}</p>
            <p className='fs-5'>Email: {user?.email}</p>

            <div
              className='logout-btn p-3 m-0 d-flex justify-content-center align-items-center text-white'
              onClick={() => navigate('/login')}
            >
              Log out
            </div>

            {!!topUserTracks?.length && (
              <div className={sectionClassName}>
                <h2>Top tracks</h2>
                <TracksList isLine={false} isLoading={isLoadingTracks} tracks={topUserTracks.slice(0, 3)} />
              </div>
            )}

            <Chips chips={['Top', 'Followed']} />

            <div className={sectionClassName}>
              <h2>{isFollowed ? 'Followed' : 'Top'} artists</h2>
              <ArtistsList
                isLine={false}
                isLoading={isFollowed ? isLoadingFollowedArtists : isLoadingArtists}
                artists={isFollowed ? followedArtists ?? [] : topUserArtists?.slice(0, 3) ?? []}
              />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
