import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { RedirectPage } from 'src/pages/RedirectPage';
import { HomePage } from 'src/pages/HomePage';
import { createContext, useEffect, useState } from 'react';
import { PlaylistsPage } from 'src/pages/PlaylistsPage';
import { LoginPage } from 'src/pages/LoginPage';
import { ArtistPage } from 'src/pages/ArtistPage';
import { AlbumPage } from 'src/pages/AlbumPage';
import { AlertProps } from 'src/types/types';
import { PodcastsPage } from 'src/pages/PodcastsPage';
import { Alert } from 'src/components/Alert';
import { DISABLED_DELAY } from 'src/utils/constants';

type GlobalContextType = {
  currentUriTrack: string | null;
  setCurrentUriTrack: React.Dispatch<React.SetStateAction<string | null>>;
  isLightTheme: boolean;
  setIsLightTheme: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertProps: React.Dispatch<React.SetStateAction<AlertProps | null>>;
  shouldShowPlaylists: boolean;
  setShouldShowPlaylists: React.Dispatch<React.SetStateAction<boolean>>;
  disabledPlaylists: string[];
  disablePlaylist: (playlistId: string) => void;
  imageToEdit: File | null;
  setImageToEdit: React.Dispatch<React.SetStateAction<File | null>>;
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

  setAlertProps: () => {
    throw new Error('Global context is not initialized');
  },
  shouldShowPlaylists: false,
  setShouldShowPlaylists: () => {
    throw new Error('Global context is not initialized');
  },
  disabledPlaylists: [],
  disablePlaylist: () => {
    throw new Error('Global context is not initialized');
  },
  imageToEdit: null,
  setImageToEdit: () => {
    throw new Error('Global context is not initialized');
  },
});

export const App = (): JSX.Element => {
  const [currentUriTrack, setCurrentUriTrack] = useState<string | null>(null);
  const [isLightTheme, setIsLightTheme] = useState(
    JSON.parse(localStorage.getItem('is_light_theme') ?? '') === 'light' ? true : false
  );

  const [alertProps, setAlertProps] = useState<AlertProps | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [shouldShowPlaylists, setShouldShowPlaylists] = useState(false);
  const [disabledPlaylists, setDisabledPlaylists] = useState<string[]>([]);
  const [imageToEdit, setImageToEdit] = useState<File | null>(null);

  const disablePlaylist = (playlistId: string) => {
    setDisabledPlaylists((prev) => [...prev, playlistId]);

    setTimeout(() => {
      setDisabledPlaylists((prev) => prev.filter((id) => id !== playlistId));
    }, DISABLED_DELAY);
  };

  useEffect(() => {
    const { body } = document;

    body.style.setProperty('--card-bg-color', isLightTheme ? '#fc8508' : '#130821');
    body.style.setProperty('--accent', isLightTheme ? '#d66d11' : '#433673');
    body.style.setProperty('--text', isLightTheme ? '#140f0b' : '#ffffff');
    body.style.setProperty('--sidebar-color', isLightTheme ? '#eb9031' : '#190b2e');
    body.style.setProperty('--main-page-color', isLightTheme ? '#fff7e8' : '#0e091a');
    body.style.setProperty('--link-text', isLightTheme ? '#cacaca' : '#8f9199');

    localStorage.setItem('is_light_theme', JSON.stringify(isLightTheme ? 'light' : 'dark'));
  }, [isLightTheme]);

  const startAlertTimer = () => {
    const id = setTimeout(() => {
      setAlertProps(null);
    }, 5000);

    setTimeoutId(id);

    return id;
  };

  const handleMouseEnter = () => {
    if (!timeoutId) return;

    clearTimeout(timeoutId);
    setTimeoutId(null);
  };

  useEffect(() => {
    const id = startAlertTimer();

    return () => clearTimeout(id);
  }, [alertProps]);

  return (
    <div className='main-page m-0 p-0'>
      <GlobalContext.Provider
        value={{
          currentUriTrack,
          setCurrentUriTrack,
          isLightTheme,
          setIsLightTheme,
          setAlertProps,
          setShouldShowPlaylists,
          shouldShowPlaylists,
          disabledPlaylists,
          disablePlaylist,
          setImageToEdit,
          imageToEdit,
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
            <Route path='/podcasts' element={<PodcastsPage />} />
          </Routes>
        </BrowserRouter>
      </GlobalContext.Provider>

      {alertProps && (
        <Alert
          onClose={() => setAlertProps(null)}
          {...alertProps}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={startAlertTimer}
        />
      )}
    </div>
  );
};
