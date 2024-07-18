export const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('spotify_token')}`,
});
