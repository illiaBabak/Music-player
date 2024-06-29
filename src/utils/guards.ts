import { TrackResponse, TrackType } from "src/types/types";

const isObj = (data: unknown): data is object =>
  typeof data === "object" && !!data;

const isString = (data: unknown): data is string => typeof data === "string";

export const isTrack = (data: unknown): data is TrackType =>
  isObj(data) &&
  "name" in data &&
  "uri" in data &&
  "album" in data &&
  "preview_url" in data &&
  isString(data.name) &&
  isString(data.uri) &&
  isObj(data.album) &&
  (isString(data.preview_url) || typeof data.preview_url === "object") &&
  "images" in data.album &&
  Array.isArray(data.album.images) &&
  data.album.images.every((el) => isObj(el) && "url" in el && isString(el.url));

export const isTrackResponse = (data: unknown): data is TrackResponse =>
  isObj(data) &&
  "tracks" in data &&
  isObj(data.tracks) &&
  "items" in data.tracks &&
  Array.isArray(data.tracks.items) &&
  data.tracks.items.every((el) => isTrack(el));
