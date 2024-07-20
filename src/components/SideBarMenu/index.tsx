import { Navbar, Container, Nav } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { capitalize } from 'src/utils/capitalize';

const LINKS = ['home', 'playlists'] as const;

const PLAYLISTS_LINKS = ['recommended', 'my-playlists'] as const;

export const SideBarMenu = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentLocationName = location.pathname.slice(1);
  const isPlaylistPage = currentLocationName.startsWith('playlists');

  return (
    <Navbar className='flex-column menu p-4' data-bs-theme='dark'>
      <Container fluid className='d-flex flex-column'>
        <Navbar.Text className='d-flex align-items-center w-100 text-white'>
          <h4>Music player</h4>
          <img
            alt='icon'
            src='https://cdn-icons-png.freepik.com/256/8010/8010011.png?semt=ais_hybrid'
            className='d-inline-block align-top menu-icon m-1'
          />
        </Navbar.Text>
        <Nav className='flex-column mt-2 w-100'>
          {LINKS.map((link) => (
            <Nav.Link
              key={link}
              onClick={() => navigate(`/${link}`)}
              className={currentLocationName.startsWith(link) ? 'selected-link' : ''}
            >
              {capitalize(link)}
            </Nav.Link>
          ))}

          {isPlaylistPage &&
            PLAYLISTS_LINKS.map((link) => (
              <Nav.Link
                key={link}
                onClick={() => navigate(`/playlists/${link}`)}
                className={`sub-link ${currentLocationName.endsWith(link) ? 'selected-link' : ''}`}
              >
                -{capitalize(link)}
              </Nav.Link>
            ))}
        </Nav>
      </Container>
    </Navbar>
  );
};
