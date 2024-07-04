import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Login } from "src/components/Login";
import { Callback } from "src/components/Callback";
import { HomePage } from "src/pages/Home";
import { TrackType } from "src/types/types";
import { createContext, useState } from "react";

type GlobalContextType = {
  currentTrack: TrackType | null;
  setCurrentTrack: React.Dispatch<React.SetStateAction<TrackType | null>>;
};

export const GlobalContext = createContext<GlobalContextType>({
  currentTrack: null,
  setCurrentTrack: () => {
    throw new Error("Global context is not initialized");
  },
});

export const App = (): JSX.Element => {
  const [currentTrack, setCurrentTrack] = useState<TrackType | null>(null);

  return (
    <GlobalContext.Provider value={{ currentTrack, setCurrentTrack }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </GlobalContext.Provider>
  );
};
