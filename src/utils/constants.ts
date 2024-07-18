export const CHIPS = ['All', 'Tracks', 'Artists', 'Albums'] as const;

export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

export const REDIRECT_URL = 'http://localhost:3000/callback';

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
  'streaming',
];
