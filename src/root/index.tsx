import { BrowserRouter, Navigate, Route, Routes, useSearchParams } from 'react-router-dom';
import { Login } from 'src/components/Login';
import { Callback } from 'src/components/Callback';
import { HomePage } from 'src/pages/Home';
import { createContext, useEffect, useState } from 'react';
import { PlaylistsPage } from 'src/pages/Playlists';

type GlobalContextType = {
  currentUriTrack: string | null;
  setCurrentUriTrack: React.Dispatch<React.SetStateAction<string | null>>;
  isLightTheme: boolean;
  setIsLightTheme: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GlobalContext = createContext<GlobalContextType>({
  currentUriTrack: null,
  setCurrentUriTrack: () => {
    throw new Error('Global context is not initialized');
  },
  isLightTheme: false,
  setIsLightTheme: () => {
    throw new Error('Global context is not initialized');
  },
});

export const App = (): JSX.Element => {
  const [currentUriTrack, setCurrentUriTrack] = useState<string | null>(null);
  const [isLightTheme, setIsLightTheme] = useState(false);

  useEffect(() => {
    const { body } = document;

    body.style.setProperty('--card-bg-color', isLightTheme ? '#56585d' : '#030c1d');
    body.style.setProperty('--card-bg-hover', isLightTheme ? '#3b3d3f' : '#040e21');
    body.style.setProperty('--container-scroll', isLightTheme ? '#4e5258' : '#081325');
    body.style.setProperty('--container-scroll-bg', isLightTheme ? '#878a90' : '#1d1f23');
    body.style.setProperty('--selected-chip-border', isLightTheme ? '#5f5f5f' : '#0e1d36');
    body.style.setProperty('--text', isLightTheme ? '#030c1d' : '#ffffff');
    body.style.setProperty('--sidebar-color', isLightTheme ? '#4d4d4d' : '#081325');
    body.style.setProperty('--main-page-color', isLightTheme ? '#dbdbdb' : '#010916');
  }, [isLightTheme]);

  return (
    <div className='main-page m-0 p-0'>
      <GlobalContext.Provider
        value={{
          currentUriTrack,
          setCurrentUriTrack,
          isLightTheme,
          setIsLightTheme,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Navigate to='/login' />} />
            <Route path='/login' element={<Login />} />
            <Route path='/callback' element={<Callback />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/playlists' element={<PlaylistsPage />} />
          </Routes>
        </BrowserRouter>
      </GlobalContext.Provider>
    </div>
  );
};
