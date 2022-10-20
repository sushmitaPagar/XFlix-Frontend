import './App.css';
import React from "react";
// import for dark theme
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import LandingPage from "./components/LandingPage";
import VideoPage from './components/VideoPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const config = {
  // mock server endpoint
  //endpoint: `https://c858dc7a-2a2f-49e9-8d8e-86e0d6bc3797.mock.pstmn.io`,
  //endpoint: `https://5c0f4ff9-1526-4ecb-a465-f0a5c07ebbce.mock.pstmn.io`
  endpoint: ` https://xflixbackendapp.herokuapp.com`
};

function App() {

  return (
    <BrowserRouter>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <Routes>
            <Route path="/" exact element={<LandingPage />}></Route>
            <Route path="/video/:id" element={<VideoPage />}></Route>
          </Routes>
      </div>
    </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
