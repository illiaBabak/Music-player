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
