import { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { usePodcastsQuery, useUserSavedPodcasts } from 'src/api/podcasts';
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

  const isMyPodcastsRoute = location.pathname.endsWith('my-podcasts');

  const { data: podcasts, isFetching: isFetchingPodcasts } = usePodcastsQuery(searchedText, {
    enabled: !!searchedText && !isMyPodcastsRoute,
  });

  const { data: userPodcasts, isFetching: isFetchingUserPodcasts } = useUserSavedPodcasts();

  const shouldShowEmptyText = isMyPodcastsRoute
    ? !userPodcasts?.length && !isFetchingUserPodcasts
    : !podcasts?.length && !isFetchingPodcasts;

  return (
    <Container className='d-flex podcasts-container p-0 m-0 flex-nowrap'>
      <Row className='row-podcasts w-100 flex-nowrap'>
        <SideBarMenu />

        <Col className={`col-content m-0 p-0 scroll-container ${currentUriTrack ? 'playing' : ''}`}>
          {podcastId ? (
            <PodcastCatalog
              podcastId={podcastId}
              isSavedPodcast={userPodcasts?.some((userPodcast) => userPodcast.id === podcastId) ?? false}
            />
          ) : (
            <>
              <Header />
              {shouldShowEmptyText && <span className='empty-text fs-4'>No podcasts :(</span>}
              <PodcastsList
                podcasts={isMyPodcastsRoute ? userPodcasts ?? [] : podcasts ?? []}
                searchedText={searchedText}
                isOwnPodcasts={isMyPodcastsRoute}
                isLoading={isFetchingUserPodcasts || isFetchingPodcasts}
                userPodcasts={userPodcasts ?? []}
              />
            </>
          )}
        </Col>

        {!!currentUriTrack && <Player />}
      </Row>
    </Container>
  );
};
