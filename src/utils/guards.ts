import {
  AlbumResponse,
  AlbumType,
  ArtistsResponse,
  ArtistType,
  ImagesArrType,
  PlaylistsResponse,
  TrackResponse,
  TrackType,
  PlaylistType,
  PlaylistItemsResponse,
  FeaturedPlaylistsResponse,
  AlbumTracksResponse,
  TrackResponseObj,
  ArtistsResponseObj,
  AlbumResponseObj,
  TopTracksType,
  TopArtistsType,
  PodcastType,
  PodcastsResponseType,
  EpisodeType,
  PodcastEpisodesResponse,
  UserType,
  UserPodcasts,
  TrackSection,
  TrackAudioAnalysis,
} from 'src/types/types';

const isObj = (data: unknown): data is object => typeof data === 'object' && !!data;

export const isString = (data: unknown): data is string => typeof data === 'string';

const isNumber = (data: unknown): data is number => typeof data === 'number';

const isBool = (data: unknown): data is boolean => typeof data === 'boolean';

const isImagesArr = (data: unknown): data is ImagesArrType =>
  Array.isArray(data) && data.every((el) => isObj(el) && 'url' in el && isString(el.url));

export const isTrack = (data: unknown): data is TrackType =>
  isObj(data) &&
  'name' in data &&
  'uri' in data &&
  'album' in data &&
  'preview_url' in data &&
  'duration_ms' in data &&
  'artists' in data &&
  'id' in data &&
  isString(data.name) &&
  isString(data.uri) &&
  isObj(data.album) &&
  (isString(data.preview_url) || typeof data.preview_url === 'object') &&
  'images' in data.album &&
  isImagesArr(data.album.images) &&
  isNumber(data.duration_ms) &&
  Array.isArray(data.artists) &&
  data.artists.every((el) => isObj(el) && 'name' in el && 'id' in el && isString(el.name) && isString(el.id)) &&
  isString(data.id);

export const isTrackResponse = (data: unknown): data is TrackResponse =>
  isObj(data) &&
  'tracks' in data &&
  isObj(data.tracks) &&
  'items' in data.tracks &&
  Array.isArray(data.tracks.items) &&
  data.tracks.items.every((el) => isTrack(el));

export const isArtist = (data: unknown): data is ArtistType =>
  isObj(data) &&
  'name' in data &&
  'genres' in data &&
  'images' in data &&
  'followers' in data &&
  'id' in data &&
  isString(data.name) &&
  Array.isArray(data.genres) &&
  data.genres.every((el) => isString(el)) &&
  isImagesArr(data.images) &&
  isObj(data.followers) &&
  'total' in data.followers &&
  isNumber(data.followers.total) &&
  isString(data.id);

export const isArtistsResponse = (data: unknown): data is ArtistsResponse =>
  isObj(data) &&
  'artists' in data &&
  isObj(data.artists) &&
  'items' in data.artists &&
  Array.isArray(data.artists.items) &&
  data.artists.items.every((el) => isArtist(el));

export const isAlbum = (data: unknown): data is AlbumType =>
  isObj(data) &&
  'artists' in data &&
  'name' in data &&
  'total_tracks' in data &&
  'release_date' in data &&
  'images' in data &&
  'id' in data &&
  Array.isArray(data.artists) &&
  data.artists.every((el) => isObj(el) && 'name' in el && isString(el.name) && 'id' in el && isString(el.id)) &&
  isString(data.name) &&
  isNumber(data.total_tracks) &&
  isString(data.release_date) &&
  isImagesArr(data.images) &&
  isString(data.id);

export const isAlbumResponse = (data: unknown): data is AlbumResponse =>
  isObj(data) &&
  'albums' in data &&
  isObj(data.albums) &&
  'items' in data.albums &&
  Array.isArray(data.albums.items) &&
  data.albums.items.every((el) => isAlbum(el));

export const isPlaylist = (data: unknown): data is PlaylistType =>
  isObj(data) &&
  'id' in data &&
  'name' in data &&
  'images' in data &&
  'description' in data &&
  'public' in data &&
  isString(data.id) &&
  isString(data.name) &&
  (isImagesArr(data.images) || (typeof data.images === 'object' && !data.images)) &&
  isString(data.description) &&
  isBool(data.public);

export const isPlaylistsResponse = (data: unknown): data is PlaylistsResponse =>
  isObj(data) && 'items' in data && Array.isArray(data.items) && data.items.every((el) => isPlaylist(el));

export const isPlaylistItemsResponse = (data: unknown): data is PlaylistItemsResponse =>
  isObj(data) &&
  'items' in data &&
  Array.isArray(data.items) &&
  data.items.every((el) => isObj(el) && 'track' in el && isTrack(el.track));

export const isTrackResponseObj = (data: unknown): data is TrackResponseObj =>
  isObj(data) && 'tracks' in data && Array.isArray(data.tracks) && data.tracks.every((el) => isTrack(el));

export const isFeaturedPlaylists = (data: unknown): data is FeaturedPlaylistsResponse =>
  isObj(data) && 'playlists' in data && isPlaylistsResponse(data.playlists);

export const isAlbumTracksResponse = (data: unknown): data is AlbumTracksResponse =>
  isObj(data) &&
  'items' in data &&
  Array.isArray(data.items) &&
  data.items.every((el) => isObj(el) && 'id' in el && isString(el.id));

export const isArtistsResponseObj = (data: unknown): data is ArtistsResponseObj =>
  isObj(data) && 'artists' in data && Array.isArray(data.artists) && data.artists.every((el) => isArtist(el));

export const isAlbumResponseObj = (data: unknown): data is AlbumResponseObj =>
  isObj(data) && 'items' in data && Array.isArray(data.items) && data.items.every((el) => isAlbum(el));

export const isTopTracks = (data: unknown): data is TopTracksType =>
  isObj(data) && 'items' in data && Array.isArray(data.items) && data.items.every((el) => isTrack(el));

export const isTopArtists = (data: unknown): data is TopArtistsType =>
  isObj(data) && 'items' in data && Array.isArray(data.items) && data.items.every((el) => isArtist(el));

export const isPodcast = (data: unknown): data is PodcastType =>
  isObj(data) &&
  'name' in data &&
  'description' in data &&
  'id' in data &&
  'images' in data &&
  'publisher' in data &&
  'uri' in data &&
  isString(data.name) &&
  isString(data.description) &&
  isString(data.id) &&
  isImagesArr(data.images) &&
  isString(data.publisher) &&
  isString(data.uri);

export const isPodcastsResponse = (data: unknown): data is PodcastsResponseType =>
  isObj(data) &&
  'shows' in data &&
  isObj(data.shows) &&
  'items' in data.shows &&
  Array.isArray(data.shows.items) &&
  data.shows.items.every((el) => isPodcast(el));

export const isEpisode = (data: unknown): data is EpisodeType =>
  isObj(data) &&
  'name' in data &&
  'description' in data &&
  'uri' in data &&
  'release_date' in data &&
  'duration_ms' in data &&
  'images' in data &&
  isString(data.name) &&
  isString(data.description) &&
  isString(data.uri) &&
  isString(data.release_date) &&
  isNumber(data.duration_ms) &&
  isImagesArr(data.images);

export const isShowsEpisodesResponse = (data: unknown): data is PodcastEpisodesResponse =>
  isObj(data) && 'items' in data && Array.isArray(data.items) && data.items.every((el) => isEpisode(el));

export const isUser = (data: unknown): data is UserType =>
  isObj(data) &&
  'id' in data &&
  isString(data.id) &&
  'display_name' in data &&
  'email' in data &&
  'images' in data &&
  isString(data.display_name) &&
  isString(data.email) &&
  isImagesArr(data.images);

export const isUserPodcasts = (data: unknown): data is UserPodcasts =>
  isObj(data) &&
  'items' in data &&
  Array.isArray(data.items) &&
  data.items.every((el) => isObj(el) && 'show' in el && isPodcast(el.show));

export const isTrackSection = (data: unknown): data is TrackSection =>
  isObj(data) && 'start' in data && 'tempo' in data && isNumber(data.start) && isNumber(data.tempo);

export const isTrackAudioAnalysis = (data: unknown): data is TrackAudioAnalysis =>
  isObj(data) && 'sections' in data && Array.isArray(data.sections) && data.sections.every((el) => isTrackSection(el));
