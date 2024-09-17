import { CategoryScale, LinearScale, PointElement, LineElement, Title, Legend, Chart, Tooltip } from 'chart.js';
import { useContext, useEffect } from 'react';
import { Col, Container, Row, Image } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTrackAnalysisQuery, useTrackQuery } from 'src/api/tracks';
import { Chips } from 'src/components/Chips';
import { Player } from 'src/components/Player';
import { SideBarMenu } from 'src/components/SideBarMenu';
import { ThemeBtn } from 'src/components/ThemeBtn';
import { GlobalContext } from 'src/root';
import { msToMinSec } from 'src/utils/msToMinSec';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const TrackPage = (): JSX.Element => {
  const { currentUriTrack, isLightTheme, setCurrentUriTrack, setShouldShowPlaylists } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const trackId = searchParams.get('track-id') ?? '';
  const section = searchParams.get('section') ?? '';

  const isTempoChart = section === 'Tempo';

  useEffect(() => {
    if (section) return;

    setSearchParams((prev) => {
      prev.set('section', 'Tempo');
      return prev;
    });
  }, [setSearchParams, section]);

  const { data: trackData } = useTrackQuery(trackId);

  const { data: trackAnalysis } = useTrackAnalysisQuery(trackId);

  const sections = trackAnalysis?.sections ?? [];
  const tempos = sections.map((section) => section.tempo);
  const temposStartTimes = sections.map((section) => section.start.toFixed(2));

  const beats = trackAnalysis?.beats ?? [];
  const beatDurations = beats.map((beat) => beat.duration);
  const beatStartTimes = beats.map((beat) => beat.start.toFixed(2));

  return (
    <Container className='d-flex track-container p-0 m-0 flex-nowrap'>
      <Row className='row-track w-100 flex-nowrap'>
        <SideBarMenu />

        <Col className={`col-content m-0 p-0 scroll-container ${currentUriTrack ? 'playing' : ''}`}>
          <div className='artist-header d-flex flex-row justify-content-between align-items-center p-3 w-100'>
            <div
              className='return-btn p-3 m-0 d-flex justify-content-between align-items-center text-white'
              onClick={() => navigate('/home')}
            >
              <span className='fs-1'>&lt;</span>
              Back
            </div>
            <ThemeBtn />
          </div>

          <div className='track-info d-flex flex-row w-100 p-3 m-1 position-relative'>
            <img
              className='track-icon object-fit-cover rounded'
              src={trackData?.album.images.length ? trackData?.album.images[0].url : '/src/images/not-found.jpg'}
              alt='track-icon'
            />

            <Image
              className={`add-icon object-fit-cover position-absolute p-1 ${isLightTheme ? 'bg' : ''}`}
              src={isLightTheme ? '/src/images/add-light-icon.png' : '/src/images/add-icon.png'}
              onClick={() => {
                setShouldShowPlaylists(true);
                navigate(`/home?track-to-add=${trackData?.uri}`);
              }}
            />

            <Image
              className={`btn-img ms-2 p-1 position-absolute object-fit-cover ${isLightTheme ? 'bg' : ''}`}
              src={isLightTheme ? '/src/images/play-icon-light.svg' : '/src/images/play.svg'}
              onClick={() => setCurrentUriTrack(trackData?.uri ?? '')}
            />

            <div className='d-flex flex-column m-2'>
              <h4>{trackData?.name}</h4>

              <div className='d-flex flex-row'>
                {trackData?.artists.map((artist, index) => (
                  <p
                    className='me-2 artist-track'
                    key={`track-artist-${index}-${artist.id}`}
                    onClick={() => navigate(`/artist?artist-id=${artist.id}`)}
                  >
                    {artist.name}
                  </p>
                ))}
              </div>

              <p>Duration: {msToMinSec(trackData?.duration_ms ?? 0)}</p>
            </div>
          </div>

          <Chips chips={['Tempo', 'Beats']} />

          <Line
            className='m-2 p-4'
            data={{
              labels: isTempoChart ? temposStartTimes : beatStartTimes,
              datasets: [
                {
                  label: isTempoChart ? 'BPM' : 'Beats',
                  data: isTempoChart ? tempos : beatDurations,
                  borderColor: isLightTheme ? '#d66d11' : '#433673',
                  backgroundColor: isLightTheme ? '#eb9031' : '#190b2e',
                  tension: 0.2,
                  borderWidth: 3.5,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    color: isLightTheme ? '#140f0b' : '#ffffff',
                  },
                },
                title: {
                  display: true,
                  text: isTempoChart ? 'Changing the tempo over time' : 'Changing the beat over time',
                  color: isLightTheme ? '#140f0b' : '#ffffff',
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: isTempoChart ? 'Section start time (sec)' : 'Beat start time (sec)',
                    color: isLightTheme ? '#140f0b' : '#ffffff',
                  },
                  ticks: {
                    color: isLightTheme ? '#140f0b' : '#ffffff',
                  },
                  grid: {
                    color: isLightTheme ? '#808080' : '#413950',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: isTempoChart ? 'Tempo (BPM)' : 'Duration',
                    color: isLightTheme ? '#140f0b' : '#ffffff',
                  },
                  ticks: {
                    color: isLightTheme ? '#140f0b' : '#ffffff',
                  },
                  grid: {
                    color: isLightTheme ? '#808080' : '#413950',
                  },
                },
              },
            }}
          />
        </Col>

        {!!currentUriTrack && <Player />}
      </Row>
    </Container>
  );
};
