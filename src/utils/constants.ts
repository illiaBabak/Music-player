export const CHIPS = ['All', 'Tracks', 'Artists', 'Albums'] as const;

export const INITIALIZE_CHIPS = ['Top', 'Recommendations'] as const;

export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

export const REDIRECT_URL = 'http://localhost:3000/redirect';

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
];

export const DIVIDE_FACTOR = 10;

export const MULTIPLACTION_FACTOR = 4.1;

export const BASE64_PATTERN = /^data:image\/(png|jpeg|jpg|gif);base64,/;

export const SIDEBAR_LINKS = [
  { route: 'home', imgPath: '/src/images/home-icon.png', imgPathLight: '/src/images/home-icon-light.png' },
  { route: 'playlists', imgPath: '/src/images/disc-icon.png', imgPathLight: '/src/images/disc-icon-light.png' },
  {
    route: 'podcasts',
    imgPath: '/src/images/micro-icon.png',
    imgPathLight: '/src/images/micro-icon-light.png',
  },
] as const;

export const PLAYLISTS_LINKS = ['recommended', 'my-playlists'] as const;

export const DISABLED_DELAY = 20000;
