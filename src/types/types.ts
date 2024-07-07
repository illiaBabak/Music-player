export type ImagesArrType = {
  url: string;
}[];

export type TrackType = {
  album: {
    images: ImagesArrType;
  };
  name: string;
  uri: string;
  preview_url: string;
};

export type TrackResponse = {
  tracks: {
    items: TrackType[];
  };
};

export type ArtistType = {
  name: string;
  genres: string[];
  images: ImagesArrType;
  followers: {
    total: number;
  };
};

export type ArtistResponse = {
  artists: {
    items: ArtistType[];
  };
};

export type AlbumType = {
  artists: {
    name: string;
  }[];
  name: string;
  total_tracks: number;
  release_date: string;
  images: ImagesArrType;
};

export type AlbumResponse = {
  albums: {
    items: AlbumType[];
  };
};
