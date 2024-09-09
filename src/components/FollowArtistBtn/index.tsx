import { useFollowedArtistsQuery, useFollowArtistQuery, useUnFollowArtistQuery } from 'src/api/artists';
import { HeartIcon } from '../HeartIcon';
import { ArtistType } from 'src/types/types';

type Props = {
  artist: ArtistType;
};

export const FollowArtistBtn = ({ artist }: Props): JSX.Element => {
  const { data: followedArtists } = useFollowedArtistsQuery();

  const { mutateAsync: followArtist } = useFollowArtistQuery();

  const { mutateAsync: unFollowArtist } = useUnFollowArtistQuery();

  const isFollowedArtist = followedArtists?.some((followedArtist) => followedArtist.id === artist.id) ?? false;

  const handleFollow = () => (isFollowedArtist ? unFollowArtist(artist.id) : followArtist(artist));

  return (
    <div
      className='follow-btn position-absolute'
      onClick={(e) => {
        e.stopPropagation();

        handleFollow();
      }}
    >
      <HeartIcon shouldColorField={!isFollowedArtist} />
    </div>
  );
};
