import { isUser } from 'src/utils/guards';
import { fetchWithRedirects } from '.';
import { BASE_URL, USER_QUERY } from './constants';
import { UserType } from 'src/types/types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useContext } from 'react';
import { GlobalContext } from 'src/root';

const getUser = async (): Promise<UserType | null> => {
  const result = await fetchWithRedirects(`${BASE_URL}/me`, 'GET');

  if (!result) throw new Error('Failed to fetch current user from Spotify API');

  return isUser(result) ? result : null;
};

export const useUserQuery = (): UseQueryResult<UserType | null, Error> => {
  const { setAlertProps } = useContext(GlobalContext);

  return useQuery({
    queryKey: [USER_QUERY],
    queryFn: async () => {
      try {
        return await getUser();
      } catch {
        setAlertProps({ type: 'error', text: 'Something went wrong with your data :(', position: 'bottom' });
        return null;
      }
    },
  });
};
