import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Login } from "src/components/Login";
import { Callback } from "src/components/Callback";
import { Header } from "src/components/Header";
import { TracksList } from "src/components/TracksList";

export const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route
          path="/home"
          element={
            <>
              <Header />
              <TracksList />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
