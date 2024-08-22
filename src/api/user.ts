import { isUser } from 'src/utils/guards';
import { getHeaders } from '.';
import { BASE_URL, USER_QUERY } from './constants';
import { UserType } from 'src/types/types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { redirectToLogin } from 'src/utils/redirect';

const getUser = async (): Promise<UserType | null> => {
  const response = await fetch(`${BASE_URL}/me`, {
    headers: getHeaders(),
  });

  if (response.status === 401) redirectToLogin();

  if (!response.ok) throw new Error('Failed to fetch current user from Spotify API');

  const responseJson: unknown = await response.json();

  return isUser(responseJson) ? responseJson : null;
};

export const useUserQuery = (): UseQueryResult<UserType | null, Error> =>
  useQuery({ queryKey: [USER_QUERY], queryFn: getUser });
