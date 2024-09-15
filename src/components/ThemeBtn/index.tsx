import { useContext } from 'react';
import { GlobalContext } from 'src/root';

export const ThemeBtn = (): JSX.Element => {
  const { isLightTheme, setIsLightTheme } = useContext(GlobalContext);

  return (
    <div className='theme-btn-wrapper px-2 mx-2'>
      <input
        type='checkbox'
        name='checkbox'
        className='switch'
        checked={isLightTheme}
        onChange={() => setIsLightTheme((prev) => !prev)}
      />
    </div>
  );
};
