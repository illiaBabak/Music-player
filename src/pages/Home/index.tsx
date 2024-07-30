import { useContext, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Header } from 'src/components/Header';
import { SideBarMenu } from 'src/components/SideBarMenu';
import { TracksList } from 'src/components/TracksList';
import { GlobalContext } from 'src/root';
import { Chips } from 'src/components/Chips';
import { ArtistsList } from 'src/components/ArtistsList';
import { AlbumsList } from 'src/components/AlbumsList';
import { Player } from 'src/components/Player';
import { useSearchParams } from 'react-router-dom';

export const HomePage = (): JSX.Element => {
  const { currentUriTrack } = useContext(GlobalContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedSection = searchParams.get('section');
  const searchedText = searchParams.get('query');

  useEffect(() => {
    if (!selectedSection)
      setSearchParams((prev) => {
        prev.set('section', 'All');
        return prev;
      });
  }, [selectedSection, setSearchParams]);

  const sectionClassName = `m-2 p-3 title`;

  return (
    <Container className='d-flex flex-nowrap home-container p-0 m-0'>
      <Row className='row-home w-100 flex-nowrap'>
        <SideBarMenu />
        <Col className='col-content m-0 p-0'>
          <Header />

          {!!searchedText && (
            <>
              <Chips />
              {selectedSection === 'All' && (
                <>
                  <h4 className={sectionClassName}>Tracks</h4>
                  <TracksList isLine={true} />

                  <h4 className={sectionClassName}>Artists</h4>
                  <ArtistsList />

                  <h4 className={sectionClassName}>Albums</h4>
                  <AlbumsList />
                </>
              )}
              {selectedSection === 'Tracks' && <TracksList isLine={false} />}
              {selectedSection === 'Artists' && <ArtistsList />}
              {selectedSection === 'Albums' && <AlbumsList />}
            </>
          )}

          {!searchedText && (
            <>
              <h4 className={sectionClassName}>Recommendations tracks</h4>
              <TracksList isLine={true} />

              <h4 className={sectionClassName}>Releases albums</h4>
              <AlbumsList />
            </>
          )}
        </Col>

        {!!currentUriTrack && <Player currentUriTrack={currentUriTrack} />}
      </Row>
    </Container>
  );
};
