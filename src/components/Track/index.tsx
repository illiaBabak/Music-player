import { useContext } from 'react';
import { Card, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from 'src/root';
import { TrackType } from 'src/types/types';
import { msToMinSec } from 'src/utils/msToMinSec';
import { calcDuration } from 'src/utils/calcDuration';
import { useAddItemsPlaylist, useDeletePlaylistTrack, usePlaylistsItemsQuery } from 'src/api/playlists';

type Props = {
  track: TrackType;
  isLine: boolean;
  isInPlaylist?: boolean;
  playlistId?: string;
  isOwnPlaylist?: boolean;
  isFirst?: boolean;
};

export const Track = ({ track, isLine, isInPlaylist, playlistId, isOwnPlaylist, isFirst }: Props): JSX.Element => {
  const { setCurrentUriTrack, isLightTheme, setShouldShowPlaylists, isTablet, isMobile } = useContext(GlobalContext);
  const navigate = useNavigate();

  const { mutateAsync: addTrack } = useAddItemsPlaylist();
  const { mutateAsync: deleteTrack } = useDeletePlaylistTrack();

  const { data: playlistTracks } = usePlaylistsItemsQuery(playlistId ?? '', {
    enabled: !!playlistId && !isInPlaylist,
  });

  const artists = track.artists || [];
  const isTrackInPlaylist = playlistTracks?.items?.some((el) => el.track.id === track.id) ?? false;

  const handleAddTrack = () => addTrack({ playlistId: playlistId ?? '', uris: [track.uri] });

  const handleDeleteTrack = () => deleteTrack({ playlistId: playlistId ?? '', uri: track.uri });

  const handleClickAddBtn = () => {
    // check if we are in playlist route
    if (playlistId && isOwnPlaylist) handleAddTrack();
    else {
      setShouldShowPlaylists(true);
      navigate(`/home?track-to-add=${track.uri}`);
    }
  };

  return (
    <Card
      className={`track ${isMobile ? 'm-1 p-1' : 'm-2 p-2'} ${isFirst && !isMobile ? 'me-4 px-3' : isMobile ? '' : 'mx-2 px-3'} d-flex flex-row align-items-center ${isLine ? 'line' : ''} position-relative text-center`}
      onClick={() => navigate(`/track?track-id=${track.id}`)}
    >
      <div className='d-flex flex-row justify-content-center align-items-center'>
        <Image
          className={`btn-img ${isMobile ? 'ms-1' : 'ms-2'} object-fit-cover rounded-circle`}
          src={isLightTheme ? '/src/images/play-icon-light.svg' : '/src/images/play.svg'}
          onClick={(e) => {
            e.stopPropagation();

            setCurrentUriTrack(track.uri);
          }}
        />

        <Card.Img
          src={
            track.album && track.album.images && !!track.album.images.length
              ? track.album.images[0].url
              : '/src/images/not-found.jpg'
          }
          className={`track-img ${isTablet ? 'ms-2' : 'ms-4'} object-fit-contain`}
        />
      </div>

      <Card.Body
        className={`track-info d-flex ${isMobile ? 'flex-column p-0 h-100 justify-content-center align-items-start ms-3' : 'flex-row justify-content-start align-items-center'} overflow-hidden`}
      >
        <span
          className={`d-inline-block fs-6 track-name text-white ${isLine ? 'mb-2' : 'overflow-hidden full-name'}`}
          style={{ animationDuration: `${calcDuration(track.name)}s` }}
        >
          {track.name}
        </span>

        {!isLine && (
          <>
            {!isMobile && (
              <span className='fs-6 track-duration text-white position-absolute'>{msToMinSec(track.duration_ms)}</span>
            )}

            <span
              className={`d-flex flex-row justify-content-start align-items-start artists-track text-white ${isMobile ? 'position-static' : 'position-absolute me-4 fs-6'} overflow-hidden`}
            >
              {artists.map((artist, index) => (
                <p
                  key={`${artist.id}-${track.id}-text`}
                  className={`artist-track m-0 ${isMobile && index === 0 ? 'ms-0' : 'ms-2'}`}
                  onClick={(e) => {
                    e.stopPropagation();

                    navigate(`/artist?artist-id=${artist.id}`);
                  }}
                >
                  {artist.name}
                </p>
              ))}
            </span>
          </>
        )}

        {(!isOwnPlaylist || (!isTrackInPlaylist && isOwnPlaylist)) && (
          <Image
            className={`icon ${isLine ? 'line' : ''} object-fit-contain position-absolute ms-3`}
            src={isLightTheme ? '/src/images/add-light-icon.png' : '/src/images/add-icon.png'}
            onClick={(e) => {
              e.stopPropagation();

              handleClickAddBtn();
            }}
          />
        )}

        {isInPlaylist && isOwnPlaylist && isTrackInPlaylist && (
          <Image
            className={`icon ${isLine ? 'line' : ''} object-fit-contain position-absolute ms-3`}
            src={isLightTheme ? '/src/images/trash-icon-light.png' : '/src/images/trash-icon.png'}
            onClick={handleDeleteTrack}
          />
        )}
      </Card.Body>
    </Card>
  );
};
