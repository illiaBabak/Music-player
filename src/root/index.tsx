import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RedirectPage } from 'src/pages/Redirect';
import { HomePage } from 'src/pages/Home';
import { createContext, useEffect, useState } from 'react';
import { PlaylistsPage } from 'src/pages/Playlists';
import { LoginPage } from 'src/pages/Login';
import { ArtistPage } from 'src/pages/Artist';
import { AlbumPage } from 'src/pages/Album';
import { ArtistType } from 'src/types/types';

type GlobalContextType = {
  currentUriTrack: string | null;
  setCurrentUriTrack: React.Dispatch<React.SetStateAction<string | null>>;
  isLightTheme: boolean;
  setIsLightTheme: React.Dispatch<React.SetStateAction<boolean>>;
  selectedArtist: ArtistType | null;
  setSelectedArtist: React.Dispatch<React.SetStateAction<ArtistType | null>>;
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
  selectedArtist: null,
  setSelectedArtist: () => {
    throw new Error('Global context is not initialized');
  },
});

export const App = (): JSX.Element => {
  const [currentUriTrack, setCurrentUriTrack] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<ArtistType | null>(null);
  const [isLightTheme, setIsLightTheme] = useState(
    JSON.parse(localStorage.getItem('is_light_theme') ?? '') === 'light' ? true : false
  );

  useEffect(() => {
    const { body } = document;

    body.style.setProperty('--card-bg-color', isLightTheme ? '#d98350' : '#130821');
    body.style.setProperty('--accent', isLightTheme ? '#b04813' : '#433673');
    body.style.setProperty('--text', isLightTheme ? '#140f0b' : '#ffffff');
    body.style.setProperty('--sidebar-color', isLightTheme ? '#ff8300' : '#190b2e');
    body.style.setProperty('--main-page-color', isLightTheme ? '#ffffff' : '#0e091a');

    localStorage.setItem('is_light_theme', JSON.stringify(isLightTheme ? 'light' : 'dark'));
  }, [isLightTheme]);

  return (
    <div className='main-page m-0 p-0'>
      <GlobalContext.Provider
        value={{
          currentUriTrack,
          setCurrentUriTrack,
          isLightTheme,
          setIsLightTheme,
          selectedArtist,
          setSelectedArtist,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Navigate to='/login' />} />
            <Route path='/*' element={<Navigate to='/redirect' />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/redirect' element={<RedirectPage />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/playlists'>
              <Route index element={<Navigate to='recommended' />} />
              <Route path='recommended' element={<PlaylistsPage />} />
              <Route path='my-playlists' element={<PlaylistsPage />} />
            </Route>
            <Route path='/artist' element={<ArtistPage />} />
            <Route path='/album' element={<AlbumPage />} />
          </Routes>
        </BrowserRouter>
      </GlobalContext.Provider>
    </div>
  );
};
