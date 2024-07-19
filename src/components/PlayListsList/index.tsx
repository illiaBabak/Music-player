import { usePlaylistsQuery } from 'src/api/playlists';
import { PlayList } from '../PlayList';
import { useSearchParams } from 'react-router-dom';
import { PlaylistType } from 'src/types/types';

const isPlaylistContainsText = (playlist: PlaylistType, text: string) =>
  playlist.name.toLocaleLowerCase().includes(text.toLocaleLowerCase());

export const PlayListsList = (): JSX.Element => {
  const [searchParams] = useSearchParams();

  const searchedText = searchParams.get('query') ?? '';

  const { data: playlists } = usePlaylistsQuery();

  const filteredPlaylists = searchedText
    ? playlists?.filter((playlist) => isPlaylistContainsText(playlist, searchedText))
    : playlists;

  return (
    <div className='playlists-list scroll-container d-flex flex-row flex-wrap align-items-center justify-content-center w-100'>
      {filteredPlaylists?.map((playlist, index) => <PlayList key={`${playlist.id}-${index}`} playlist={playlist} />)}
    </div>
  );
};