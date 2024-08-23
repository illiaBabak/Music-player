import { useContext, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Header } from 'src/components/Header';
import { SideBarMenu } from 'src/components/SideBarMenu';
import { TracksList } from 'src/components/TracksList';
import { GlobalContext } from 'src/root';
import { Chips } from 'src/pages/HomePage/components/Chips';
import { ArtistsList } from 'src/components/ArtistsList';
import { AlbumsList } from 'src/components/AlbumsList';
import { Player } from 'src/components/Player';
import { useSearchParams } from 'react-router-dom';
import { useRecommendationTracksQuery, useSearchTracksQuery, useTopUserTracksQuery } from 'src/api/tracks';
import { useSearchArtistQuery, useTopUserArtistsQuery } from 'src/api/artists';
import { useReleasesAlbumsQuery, useSearchAlbumsQuery } from 'src/api/albums';
import { PlaylistsModal } from 'src/components/PlaylistsModal';

export const HomePage = (): JSX.Element => {
  const { currentUriTrack, shouldShowPlaylists, setShouldShowPlaylists } = useContext(GlobalContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedSection = searchParams.get('section');
  const searchedText = searchParams.get('query') ?? '';

  const sectionClassName = `m-2 p-3 title`;

  const isRecommendationsSection = selectedSection === 'Recommendations';

  const isTopSection = selectedSection === 'Top';

  const { data: tracks, isFetching: isFetchingTracks } = useSearchTracksQuery(searchedText, {
    enabled: !!searchedText,
  });

  const { data: recommendationsTracks, isFetching: isFetchingRecommendations } = useRecommendationTracksQuery({
    enabled: isRecommendationsSection,
    refetchInterval: 90000,
  });

  const { data: topTracks, isFetching: isFetchingTopTracks } = useTopUserTracksQuery({ enabled: isTopSection });

  const { data: albums, isFetching: isFetchingAlbums } = useSearchAlbumsQuery(searchedText, {
    enabled: !!searchedText,
  });

  const { data: releasesAlbums, isFetching: isFetchingReleases } = useReleasesAlbumsQuery({
    enabled: isRecommendationsSection,
  });

  const { data: artists, isFetching: isFetchingArtists } = useSearchArtistQuery(searchedText, {
    enabled: !!searchedText,
  });

  const { data: topArtists, isFetching: isFetchingTopArtists } = useTopUserArtistsQuery({ enabled: isTopSection });

  useEffect(() => {
    if ((!selectedSection || selectedSection === 'All') && !searchedText)
      setSearchParams((prev) => {
        prev.set('section', 'Top');
        return prev;
      });

    if ((isTopSection || isRecommendationsSection) && searchedText)
      setSearchParams((prev) => {
        prev.set('section', 'All');
        return prev;
      });
  }, [setSearchParams, selectedSection, searchedText, isTopSection, isRecommendationsSection]);

  return (
    <Container className='d-flex flex-nowrap home-container p-0 m-0'>
      <Row className='row-home w-100 flex-nowrap'>
        <SideBarMenu />

        {shouldShowPlaylists && <PlaylistsModal onClose={() => setShouldShowPlaylists(false)} />}

        <Col className={`col-content m-0 p-0 scroll-container ${currentUriTrack ? 'playing' : ''}`}>
          <Header />

          <Chips isInitialize={!searchedText} />

          {!!searchedText && (
            <>
              {selectedSection === 'All' && (
                <>
                  <h4 className={sectionClassName}>Tracks</h4>
                  <TracksList isLine={true} tracks={tracks ?? []} isLoading={isFetchingTracks} />

                  <h4 className={sectionClassName}>Artists</h4>
                  <ArtistsList artists={artists ?? []} isLine={true} isLoading={isFetchingArtists} />

                  <h4 className={sectionClassName}>Albums</h4>
                  <AlbumsList isLine={true} isLoading={isFetchingAlbums} albums={albums ?? []} />
                </>
              )}
              {selectedSection === 'Tracks' && (
                <TracksList isLine={false} tracks={tracks ?? []} isLoading={isFetchingTracks} />
              )}
              {selectedSection === 'Artists' && (
                <ArtistsList artists={artists ?? []} isLine={false} isLoading={isFetchingArtists} />
              )}
              {selectedSection === 'Albums' && (
                <AlbumsList isLine={false} isLoading={isFetchingAlbums} albums={albums ?? []} />
              )}
            </>
          )}

          {!searchedText && (
            <>
              {isRecommendationsSection && (
                <>
                  <h4 className={sectionClassName}>Recommendations tracks</h4>

                  <TracksList
                    isLine={true}
                    isLoading={isFetchingRecommendations}
                    tracks={recommendationsTracks ?? []}
                  />

                  <h4 className={sectionClassName}>Releases albums</h4>
                  <AlbumsList isLine={true} albums={releasesAlbums ?? []} isLoading={isFetchingReleases} />
                </>
              )}

              {isTopSection && (
                <>
                  <h4 className={sectionClassName}>Your top tracks</h4>
                  <TracksList isLine={true} isLoading={isFetchingTopTracks} tracks={topTracks ?? []} />

                  {!!topArtists?.length && (
                    <>
                      <h4 className={sectionClassName}>Your top artists</h4>
                      <ArtistsList isLine={true} artists={topArtists} isLoading={isFetchingTopArtists} />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </Col>

        {!!currentUriTrack && <Player />}
      </Row>
    </Container>
  );
};
