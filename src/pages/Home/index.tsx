import { useContext } from 'react';
import { Col, Container, Navbar, Row } from 'react-bootstrap';
import { Header } from 'src/components/Header';
import { SideBarMenu } from 'src/components/SideBarMenu';
import { TracksList } from 'src/components/TracksList';
import { GlobalContext } from 'src/root';
import { Chips } from 'src/components/Chips';
import { ArtistsList } from 'src/components/ArtistsList';
import { AlbumsList } from 'src/components/AlbumsList';
import { Player } from 'src/components/Player';

export const HomePage = (): JSX.Element => {
  const { currentUriTrack, selectedSection } = useContext(GlobalContext);

  const sectionClassName = `m-2 p-3 title`;

  return (
    <Container className='d-flex flex-nowrap home-container p-0 m-0'>
      <Row className='row-home w-100 flex-nowrap'>
        <SideBarMenu />
        <Col className='col-content m-0 p-0'>
          <Header />
          <Chips />
          {selectedSection === 'All' && (
            <>
              <h4 className={sectionClassName}>Tracks</h4>
              <TracksList />

              <h4 className={sectionClassName}>Artists</h4>
              <ArtistsList />

              <h4 className={sectionClassName}>Albums</h4>
              <AlbumsList />
            </>
          )}
          {selectedSection === 'Tracks' && <TracksList />}
          {selectedSection === 'Artists' && <ArtistsList />}
          {selectedSection === 'Albums' && <AlbumsList />}
        </Col>

        {!!currentUriTrack && <Player currentUriTrack={currentUriTrack} />}
      </Row>
    </Container>
  );
};
