import { Fragment, useContext } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { GlobalContext } from 'src/root';
import { capitalize } from 'src/utils/capitalize';

const LINKS = [
  { route: 'home', imgPath: '/src/images/home-icon.png', imgPathLight: '/src/images/home-icon-light.png' },
  { route: 'playlists', imgPath: '/src/images/disc-icon.png', imgPathLight: '/src/images/disc-icon-light.png' },
  {
    route: 'podcasts',
    imgPath: '/src/images/micro-icon.png',
    imgPathLight: '/src/images/micro-icon-light.png',
  },
] as const;

const PLAYLISTS_LINKS = ['recommended', 'my-playlists'] as const;

export const SideBarMenu = (): JSX.Element => {
  const { isLightTheme } = useContext(GlobalContext);
  const navigate = useNavigate();
  const location = useLocation();

  const currentLocationName = location.pathname.slice(1);
  const isPlaylistPage = currentLocationName.startsWith('playlists');

  return (
    <Navbar className='flex-column menu p-4' data-bs-theme='dark'>
      <Container fluid className='d-flex flex-column'>
        <img
          alt='icon'
          src={isLightTheme ? '/src/images/light-logo.png' : '/src/images/logo.png'}
          className='d-inline-block align-top menu-icon m-1'
        />

        <Nav className='flex-column mt-4 w-100'>
          {LINKS.map((link, index) => (
            <Fragment key={`link-fragment-${link.route}-${index}`}>
              <div
                key={`link-${link.route}-${index}`}
                className={`link d-flex flex-row align-items-center p-2 m-1 ${
                  currentLocationName.startsWith(link.route) ? 'selected-link' : ''
                }`}
                onClick={() => navigate(`/${link.route}`)}
              >
                <img
                  key={`link-${link.route}-${index}-img`}
                  src={isLightTheme ? link.imgPathLight : link.imgPath}
                  className='link-icon me-2'
                />
                {capitalize(link.route)}
              </div>

              {isPlaylistPage &&
                link.route === 'playlists' &&
                PLAYLISTS_LINKS.map((subLink, subIndex) => (
                  <Nav.Link
                    key={`sub-link-${subLink}-${subIndex}`}
                    onClick={() => navigate(`/playlists/${subLink}`)}
                    className={`sub-link ms-4 m-1 ${currentLocationName.endsWith(subLink) ? 'selected-link' : ''}`}
                  >
                    -{capitalize(subLink)}
                  </Nav.Link>
                ))}
            </Fragment>
          ))}
        </Nav>
      </Container>
    </Navbar>
  );
};
