import { useEffect, useState } from 'react';

type DevicesType = {
  isTablet: boolean;
};

export const useGetDeviceType = (): DevicesType => {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const windowSizeHandler = () => {
      setIsTablet(window.innerWidth < 992);
    };

    window.addEventListener('resize', windowSizeHandler);

    return () => window.removeEventListener('resize', windowSizeHandler);
  }, []);

  return { isTablet };
};
