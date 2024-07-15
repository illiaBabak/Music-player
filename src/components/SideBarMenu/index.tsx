import { useContext } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "src/root";

export const SideBarMenu = (): JSX.Element => {
  const { isLightTheme } = useContext(GlobalContext);
  const navigate = useNavigate();

  return (
    <Navbar
      className={`flex-column menu p-4 ${isLightTheme ? "light" : "dark"}`}
      data-bs-theme="dark"
    >
      <Container fluid className="d-flex flex-column">
        <Navbar.Text className="d-flex align-items-center label">
          <h4>Music player</h4>
          <img
            alt="icon"
            src="https://cdn-icons-png.freepik.com/256/8010/8010011.png?semt=ais_hybrid"
            className="d-inline-block align-top menu-icon m-1"
          />
        </Navbar.Text>
        <Nav className="flex-column mt-2 nav-column">
          <Nav.Link onClick={() => navigate("/home")}>Home</Nav.Link>
          <Nav.Link onClick={() => navigate("/playlists")}>Playlists</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};
