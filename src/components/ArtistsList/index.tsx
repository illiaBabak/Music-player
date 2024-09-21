import { Artist } from '../Artist';
import { ArtistType } from 'src/types/types';
import { SkeletonLoader } from '../SkeletonLoader';
import { useContext, useRef } from 'react';
import { GlobalContext } from 'src/root';
import { useGetElSize } from 'src/hooks/useGetElSize';

type Props = {
  artists: ArtistType[];
  isLine: boolean;
  isLoading: boolean;
};

export const ArtistsList = ({ artists, isLine, isLoading }: Props): JSX.Element => {
  const { isMobile } = useContext(GlobalContext);

  const elRef = useRef<HTMLInputElement | null>(null);
  const { width, height } = useGetElSize(elRef);

  return (
    <div className={`content-container scroll-container artist-list ${isLine ? 'line' : ''}`}>
      <div className={`invisible position-absolute artist ${isLine ? 'line' : ''}`} ref={elRef} />

      {isLoading
        ? Array.from({ length: 10 }).map((_, index) => (
            <SkeletonLoader
              key={`artist-skeleton-${index}`}
              height={height}
              width={width}
              borderRadius='50%'
              className={`p-2 m-2 ${!isMobile && isLine ? 'mx-4' : ''}`}
            />
          ))
        : artists?.map((artist, index) => (
            <Artist artist={artist} key={`${artist.name}-${index}-artist`} isLine={isLine} />
          ))}
    </div>
  );
};
