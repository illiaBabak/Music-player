import { redirectToLogin } from 'src/utils/redirect';

type Methods = 'GET' | 'PUT' | 'POST' | 'DELETE';

export const getHeaders = (): {
  Authorization: string;
} => ({
  Authorization: `Bearer ${localStorage.getItem('spotify_token')}`,
});

export const fetchWithRedirects = async (
  url: string,
  method: Methods,
  body?: string,
  additionalHeaders?: { 'Content-Type': string }
): Promise<unknown> => {
  const response = await fetch(url, {
    headers: { ...getHeaders(), ...additionalHeaders },
    method,
    body,
  });

  if (response.status === 401) redirectToLogin();

  if (method !== 'GET') return response;

  const responseJson: unknown = await response.json();

  return responseJson;
};
