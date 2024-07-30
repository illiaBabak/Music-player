import dayjs from 'dayjs';

export const formatDate = (dateToFormat: string): string => {
  const date = dayjs(dateToFormat, 'YYYY-MM-DD');

  return date.format('DD MMMM YYYY');
};
