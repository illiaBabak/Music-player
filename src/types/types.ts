import { CHIPS, INITIALIZE_CHIPS } from 'src/utils/constants';

export type ImagesArrType = {
  url: string;
}[];

export type TrackType = {
  album: {
    images: ImagesArrType;
  };
  artists: {
    name: string;
    id: string;
  }[];
  duration_ms: number;
  name: string;
  uri: string;
  preview_url: string;
  id: string;
};

export type TrackResponse = {
  tracks: {
    items: TrackType[];
  };
};

export type ArtistType = {
  id: string;
  name: string;
  genres: string[];
  images: ImagesArrType;
  followers: {
    total: number;
  };
};

export type ArtistsResponse = {
  artists: {
    items: ArtistType[];
  };
};

export type AlbumType = {
  artists: {
    name: string;
    id: string;
  }[];
  name: string;
  total_tracks: number;
  release_date: string;
  images: ImagesArrType;
  id: string;
};

export type AlbumResponse = {
  albums: {
    items: AlbumType[];
  };
};

export type PlaylistType = {
  name: string;
  id: string;
  images: ImagesArrType | null;
  description: string;
  public: boolean;
};

export type PlaylistsResponse = {
  items: PlaylistType[];
};

export type PlaylistItemsResponse = {
  items: {
    track: TrackType;
  }[];
};

export type ChipType = (typeof CHIPS)[number];

export type InitializeChipType = (typeof INITIALIZE_CHIPS)[number];

export type TrackResponseObj = {
  tracks: TrackType[];
};

export type FeaturedPlaylistsResponse = {
  playlists: PlaylistsResponse;
};

export type AlbumTracksResponse = {
  items: {
    id: string;
  }[];
};

export type ArtistsResponseObj = {
  artists: ArtistType[];
};

export type AlbumResponseObj = {
  items: AlbumType[];
};

export type TopTracksType = {
  items: TrackType[];
};

export type TopArtistsType = {
  items: ArtistType[];
};

export type PodcastType = {
  name: string;
  description: string;
  id: string;
  images: ImagesArrType;
  publisher: string;
  uri: string;
};

export type PodcastsResponseType = {
  shows: {
    items: PodcastType[];
  };
};

export type EpisodeType = {
  name: string;
  description: string;
  uri: string;
  release_date: string;
  duration_ms: number;
  images: ImagesArrType;
};

export type PodcastEpisodesResponse = {
  items: EpisodeType[];
};

export type UserPodcasts = {
  items: {
    show: PodcastType;
  }[];
};

export type UserType = {
  id: string;
};

export type AlertProps = {
  text: string;
  type: 'success' | 'error';
  position: 'top' | 'bottom';
};
