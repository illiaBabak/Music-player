import { useState, useLayoutEffect } from 'react';

type Size = {
  width: string;
  height: string;
};

export const useGetElSize = (ref: React.RefObject<HTMLElement>): Size => {
  const [size, setSize] = useState<Size>({ width: '0px', height: '0px' });

  useLayoutEffect(() => {
    if (ref.current) {
      const updateSize = () =>
        setSize({
          width: `${ref.current?.getBoundingClientRect().width}px`,
          height: `${ref.current?.getBoundingClientRect().height}px`,
        });

      updateSize();

      window.addEventListener('resize', updateSize);

      return () => window.removeEventListener('resize', updateSize);
    }
  }, [ref]);

  return { ...size };
};
