import { useFeaturedPlaylistsQuery, usePlaylistsQuery } from 'src/api/playlists';
import { PlayList } from '../PlayList';
import { useSearchParams } from 'react-router-dom';
import { PlaylistType } from 'src/types/types';
import { Loader } from '../Loader';
import { useContext, useEffect } from 'react';
import { GlobalContext } from 'src/root';

type Props = {
  showRecommendations: boolean;
  setSelectedPlaylists?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedPlaylists?: string[];
};

const isPlaylistContainsText = (playlist: PlaylistType, text: string) =>
  playlist.name.toLocaleLowerCase().includes(text.toLocaleLowerCase());

export const PlayListsList = ({ showRecommendations, setSelectedPlaylists, selectedPlaylists }: Props): JSX.Element => {
  const { disabledPlaylists } = useContext(GlobalContext);
  const [searchParams] = useSearchParams();

  const searchedText = searchParams.get('query') ?? '';

  const {
    data: playlists,
    isFetching: isFetchingPlaylists,
    refetch,
  } = usePlaylistsQuery({ enabled: !showRecommendations });
  const { data: featuredPlaylists, isFetching: isFetchinFeaturedPlaylists } = useFeaturedPlaylistsQuery({
    enabled: showRecommendations,
  });

  useEffect(() => {
    refetch();
  }, [disabledPlaylists, refetch]);

  const filteredPlaylists = searchedText
    ? (showRecommendations ? featuredPlaylists : playlists)?.filter((playlist) =>
        isPlaylistContainsText(playlist, searchedText)
      )
    : showRecommendations
      ? featuredPlaylists
      : playlists;

  return (
    <div className='playlists-list scroll-container d-flex flex-row flex-wrap align-items-center justify-content-center w-100'>
      {(isFetchingPlaylists || isFetchinFeaturedPlaylists) && <Loader />}

      {filteredPlaylists?.map((playlist, index) => (
        <PlayList
          key={`${playlist.id ?? ''}-${index}`}
          playlist={playlist}
          setSelectedPlaylists={setSelectedPlaylists}
          selectedPlaylists={selectedPlaylists}
        />
      ))}
    </div>
  );
};
