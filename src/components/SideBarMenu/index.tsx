import { Navbar, Container, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const SideBarMenu = (): JSX.Element => {
  const navigate = useNavigate();

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
          <Nav.Link onClick={() => navigate('/home')}>Home</Nav.Link>
          <Nav.Link onClick={() => navigate('/playlists')}>Playlists</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};
