import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { deepPurple, grey } from "@mui/material/colors";
import Header from "./components/Header";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { SessionListPage } from "./pages/SessionListPage";

const theme = createTheme({
  palette: {
    primary: {
      main: grey[900],
    },
    secondary: {
      main: deepPurple[900],
    },
  },
});

const RootLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<SessionListPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
