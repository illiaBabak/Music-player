export const getHeaders = (): {
  Authorization: string;
} => ({
  Authorization: `Bearer ${localStorage.getItem('spotify_token')}`,
});
