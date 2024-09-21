import { Fragment, useContext, useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { GlobalContext } from 'src/root';
import { capitalize } from 'src/utils/capitalize';
import { CreatePlaylistWindow } from '../CreatePlaylistWindow';
import { PLAYLISTS_LINKS, PODCASTS_LINKS, SIDEBAR_LINKS } from 'src/utils/constants';
import { useUserQuery } from 'src/api/user';

export const SideBarMenu = (): JSX.Element => {
  const { isLightTheme, currentUriTrack, isTablet, isMobile } = useContext(GlobalContext);
  const navigate = useNavigate();
  const location = useLocation();

  const { data: user, isLoading: isLoadingUser } = useUserQuery();

  const [shouldShowModal, setShouldShowModal] = useState(false);

  const currentLocationName = location.pathname.slice(1);
  const isPlaylistPage = currentLocationName.startsWith('playlists');
  const isPodcastPage = currentLocationName.startsWith('podcasts');

  return (
    <>
      {shouldShowModal && <CreatePlaylistWindow onClose={() => setShouldShowModal(false)} />}

      <Navbar
        className={`d-flex flex-column menu ${isMobile ? 'p-0' : isTablet ? 'p-3' : 'p-4'} position-relative`}
        data-bs-theme='dark'
      >
        <Container
          fluid
          className={`d-flex flex-column menu-nav ${isMobile ? 'm-0 p-0 align-items-center justify-content-center' : 'px-3'}`}
        >
          <img
            alt='icon'
            src={isLightTheme ? '/src/images/logo-light.png' : '/src/images/logo.png'}
            className={`d-inline-block align-top menu-icon ${isMobile ? 'm-0' : 'm-1'} object-fit-contain`}
          />

          <Nav
            className={`d-flex flex-column justify-content-center ${isMobile ? 'm-0 mt-3 align-items-center' : 'mt-4 align-items-start'} w-100`}
          >
            {SIDEBAR_LINKS.map((link, index) => (
              <Fragment key={`link-fragment-${link.route}-${index}`}>
                <div
                  key={`link-${link.route}-${index}`}
                  className={`link d-flex flex-row align-items-center ${isMobile ? 'mx-0 my-1 w-80 mt-2' : 'p-2 m-1 w-100'} ${
                    currentLocationName.startsWith(link.route) ? 'selected-link text-white' : ''
                  }`}
                  onClick={() => navigate(`/${link.route}`)}
                >
                  <img
                    key={`link-${link.route}-${index}-img`}
                    src={isLightTheme ? link.imgPathLight : link.imgPath}
                    className={`link-icon ${isMobile ? 'm-0' : 'me-2'} object-fit-contain`}
                  />
                  {isMobile ? '' : capitalize(link.route)}
                </div>

                {isPlaylistPage &&
                  link.route === 'playlists' &&
                  PLAYLISTS_LINKS.map((subLink, subIndex) => (
                    <Nav.Link
                      key={`sub-link-${subLink}-${subIndex}`}
                      onClick={() => navigate(`/playlists/${subLink}`)}
                      className={`sub-link d-flex align-items-center w-100 ${
                        isMobile ? 'ms-1 justify-content-center' : 'ms-3 justify-content-start'
                      } m-1 ${currentLocationName.endsWith(subLink) ? 'selected-link text-white' : ''}`}
                    >
                      {isMobile ? capitalize(subLink.slice(0, 1)) : `-${capitalize(subLink)}`}
                    </Nav.Link>
                  ))}

                {isPodcastPage &&
                  link.route === 'podcasts' &&
                  PODCASTS_LINKS.map((subLink, subIndex) => (
                    <Nav.Link
                      key={`sub-link-${subLink}-${subIndex}`}
                      onClick={() => navigate(`/podcasts/${subLink}`)}
                      className={`sub-link d-flex align-items-center  w-100 ${
                        isMobile ? 'ms-1 justify-content-center' : 'ms-3 justify-content-start'
                      } m-1 ${currentLocationName.endsWith(subLink) ? 'selected-link text-white' : ''}`}
                    >
                      {isMobile ? capitalize(subLink.slice(0, 1)) : `-${capitalize(subLink)}`}
                    </Nav.Link>
                  ))}
              </Fragment>
            ))}

            <div
              className={`link d-flex flex-row align-items-center w-100 ${isMobile ? 'p-0 mx-0 my-1' : 'p-2 m-1'}`}
              onClick={() => setShouldShowModal(true)}
            >
              <img
                src={isLightTheme ? '/src/images/add-light-icon.png' : '/src/images/add-icon.png'}
                className={`link-icon ${isMobile ? 'me-1' : 'me-2'}`}
              />
              {isMobile ? '' : 'Create playlist'}
            </div>
          </Nav>
        </Container>

        {!isLoadingUser && (
          <div
            className={`link user d-flex flex-row align-items-center justify-content-start w-100 ${isMobile ? 'p-0 m-0' : 'p-1 m-1'} position-absolute ${currentUriTrack ? 'playing' : ''}`}
            onClick={() => navigate('/user')}
          >
            <img
              className={`user-img m-1 ${isMobile ? '' : 'ms-4 p-1'} rounded-circle`}
              src={user?.images.length ? user.images[0].url : '/src/images/not-found.jpg'}
              alt='icon'
            />
            {!isMobile && <h5 className='text-white m-0 p-1'>{user?.display_name}</h5>}
          </div>
        )}
      </Navbar>
    </>
  );
};
