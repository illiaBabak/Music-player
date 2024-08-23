import { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { usePodcastsQuery } from 'src/api/podcasts';
import { Header } from 'src/components/Header';
import { Player } from 'src/components/Player';
import { PodcastCatalog } from 'src/pages/PodcastsPage/components/PodcastCatalog';
import { PodcastsList } from 'src/pages/PodcastsPage/components/PodcastsList';
import { SideBarMenu } from 'src/components/SideBarMenu';
import { GlobalContext } from 'src/root';

export const PodcastsPage = (): JSX.Element => {
  const { currentUriTrack } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();

  const searchedText = searchParams.get('query') ?? '';
  const podcastId = searchParams.get('podcast-id');

  const { data: podcasts, isFetching: isFetchingPodcasts } = usePodcastsQuery(searchedText, {
    enabled: !!searchedText,
  });

  return (
    <Container className='d-flex podcasts-container p-0 m-0 flex-nowrap'>
      <Row className='row-podcasts w-100 flex-nowrap'>
        <SideBarMenu />

        <Col className={`col-content m-0 p-0 scroll-container ${currentUriTrack ? 'playing' : ''}`}>
          {podcastId ? (
            <PodcastCatalog podcastId={podcastId} />
          ) : (
            <>
              <Header />
              {podcasts?.length ? (
                <PodcastsList podcasts={podcasts ?? []} isLoading={isFetchingPodcasts} />
              ) : (
                <span className='empty-text fs-4'>No podcasts found :(</span>
              )}
            </>
          )}
        </Col>

        {!!currentUriTrack && <Player />}
      </Row>
    </Container>
  );
};
