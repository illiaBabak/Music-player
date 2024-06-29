export type TrackType = {
  album: {
    images: {
      url: string;
    }[];
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
