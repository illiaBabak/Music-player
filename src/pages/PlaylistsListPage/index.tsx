import { Container, Row, Col } from 'react-bootstrap';
import { Header } from 'src/components/Header';
import { PlayListsList } from 'src/components/PlayListsList';
import { SideBarMenu } from 'src/components/SideBarMenu';

type Props = {
  isRecommendedRoute: boolean;
};

export const PlaylistsListPage = ({ isRecommendedRoute }: Props): JSX.Element => {
  return (
    <Container className='d-flex playlists-container p-0 m-0 flex-nowrap'>
      <Row className='row-playlists w-100 flex-nowrap'>
        <SideBarMenu />

        <Col className={`col-content m-0 p-0 scroll-container`}>
          <Header />
          <PlayListsList showRecommendations={isRecommendedRoute} />
        </Col>
      </Row>
    </Container>
  );
};
