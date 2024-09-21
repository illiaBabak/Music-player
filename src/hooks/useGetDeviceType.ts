import { useEffect, useState } from 'react';

type DevicesType = {
  isTablet: boolean;
  isMobile: boolean;
};

export const useGetDeviceType = (): DevicesType => {
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 992);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const windowSizeHandler = () => {
      setIsTablet(window.innerWidth <= 992);
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', windowSizeHandler);

    return () => window.removeEventListener('resize', windowSizeHandler);
  }, []);

  return { isTablet, isMobile };
};
