import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Login } from "src/components/Login";
import { Callback } from "src/components/Callback";
import { HomePage } from "src/pages/Home";
import { TrackType } from "src/types/types";
import { createContext, useEffect, useState } from "react";
import { PlaylistsPage } from "src/pages/Playlists";

type GlobalContextType = {
  currentTrack: TrackType | null;
  setCurrentTrack: React.Dispatch<React.SetStateAction<TrackType | null>>;
  isLightTheme: boolean;
  setIsLightTheme: React.Dispatch<React.SetStateAction<boolean>>;
  selectedChip: string;
  setSelectedChip: React.Dispatch<React.SetStateAction<string>>;
};

export const GlobalContext = createContext<GlobalContextType>({
  currentTrack: null,
  setCurrentTrack: () => {
    throw new Error("Global context is not initialized");
  },
  isLightTheme: false,
  setIsLightTheme: () => {
    throw new Error("Global context is not initialized");
  },
  selectedChip: "",
  setSelectedChip: () => {
    throw new Error("Global context is not initialized");
  },
});

export const App = (): JSX.Element => {
  const [currentTrack, setCurrentTrack] = useState<TrackType | null>(null);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [selectedChip, setSelectedChip] = useState("All");

  useEffect(() => {
    const { body } = document;

    body.className = "";

    body.classList.add(`${isLightTheme ? "light" : "dark"}`);
  }, [isLightTheme]);

  return (
    <GlobalContext.Provider
      value={{
        currentTrack,
        setCurrentTrack,
        isLightTheme,
        setIsLightTheme,
        selectedChip,
        setSelectedChip,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/playlists" element={<PlaylistsPage />} />
        </Routes>
      </BrowserRouter>
    </GlobalContext.Provider>
  );
};
