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

  const { data: tracks, isLoading: isLoadingTracks } = useSearchTracksQuery(searchedText, {
    enabled: !!searchedText,
  });

  const { data: recommendationsTracks, isLoading: isLoadingRecommendations } = useRecommendationTracksQuery({
    enabled: isRecommendationsSection,
    refetchInterval: 90000,
  });

  const { data: topTracks, isLoading: isLoadingTopTracks } = useTopUserTracksQuery({ enabled: isTopSection });

  const { data: albums, isLoading: isLoadingAlbums } = useSearchAlbumsQuery(searchedText, {
    enabled: !!searchedText,
  });

  const { data: releasesAlbums, isLoading: isLoadingReleases } = useReleasesAlbumsQuery({
    enabled: isRecommendationsSection,
  });

  const { data: artists, isLoading: isLoadingArtists } = useSearchArtistQuery(searchedText, {
    enabled: !!searchedText,
  });

  const { data: topArtists, isLoading: isLoadingTopArtists } = useTopUserArtistsQuery({ enabled: isTopSection });

  useEffect(() => {
    if (
      ((!selectedSection || selectedSection === 'All') && !searchedText) ||
      (!searchedText && selectedSection !== 'All' && selectedSection !== 'Recommendations')
    )
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
      <Row className='row-home flex-nowrap'>
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
                  <TracksList isLine={true} tracks={tracks ?? []} isLoading={isLoadingTracks} />

                  <h4 className={sectionClassName}>Artists</h4>
                  <ArtistsList artists={artists ?? []} isLine={true} isLoading={isLoadingArtists} />

                  <h4 className={sectionClassName}>Albums</h4>
                  <AlbumsList isLine={true} isLoading={isLoadingAlbums} albums={albums ?? []} />
                </>
              )}
              {selectedSection === 'Tracks' && (
                <TracksList isLine={false} tracks={tracks ?? []} isLoading={isLoadingTracks} />
              )}
              {selectedSection === 'Artists' && (
                <ArtistsList artists={artists ?? []} isLine={false} isLoading={isLoadingArtists} />
              )}
              {selectedSection === 'Albums' && (
                <AlbumsList isLine={false} isLoading={isLoadingAlbums} albums={albums ?? []} />
              )}
            </>
          )}

          {!searchedText && (
            <>
              {isRecommendationsSection && (
                <>
                  {!(!isLoadingRecommendations && !recommendationsTracks?.length) && (
                    <>
                      <h4 className={sectionClassName}>Recommendations tracks</h4>

                      <TracksList
                        isLine={true}
                        isLoading={isLoadingRecommendations}
                        tracks={recommendationsTracks ?? []}
                      />
                    </>
                  )}

                  <h4 className={sectionClassName}>Releases albums</h4>
                  <AlbumsList isLine={true} albums={releasesAlbums ?? []} isLoading={isLoadingReleases} />
                </>
              )}

              {isTopSection && (
                <>
                  <h4 className={sectionClassName}>Your top tracks</h4>
                  <TracksList isLine={true} isLoading={isLoadingTopTracks} tracks={topTracks ?? []} />

                  {!!topArtists?.length && (
                    <>
                      <h4 className={sectionClassName}>Your top artists</h4>
                      <ArtistsList isLine={true} artists={topArtists} isLoading={isLoadingTopArtists} />
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
