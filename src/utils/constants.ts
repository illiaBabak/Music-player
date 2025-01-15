export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

export const REDIRECT_URL = 'https://music-player-hc8h.vercel.app/redirect';

export const API_URL = 'https://accounts.spotify.com/authorize';

export const SCOPES = [
  'user-read-email',
  'user-read-private',
  'user-modify-playback-state',
  'user-read-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-read-playback-position',
  'user-top-read',
  'playlist-read-private',
  'playlist-modify-public',
  'playlist-modify-private',
  'streaming',
  'ugc-image-upload',
  'user-library-read',
  'user-library-modify',
  'user-follow-read',
  'user-follow-modify',
];

export const DIVIDE_FACTOR = 10;

export const MULTIPLACTION_FACTOR = 4.1;

export const BASE64_PATTERN = /^data:image\/(png|jpeg|jpg|gif);base64,/;

export const SIDEBAR_LINKS = [
  {
    route: 'home',
    imgPath: '/home-icon.png',
    imgPathLight: '/home-icon-light.png',
  },
  {
    route: 'playlists',
    imgPath: '/disc-icon.png',
    imgPathLight: '/disc-icon-light.png',
  },
  {
    route: 'podcasts',
    imgPath: '/micro-icon.png',
    imgPathLight: '/micro-icon-light.png',
  },
] as const;

export const PLAYLISTS_LINKS = ['my-playlists', 'recommended'] as const;

export const PODCASTS_LINKS = ['my-podcasts', 'searched-podcasts'] as const;

export const MAX_IMG_SIZE = 256;
