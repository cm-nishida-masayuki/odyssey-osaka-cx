import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { deepPurple, grey } from "@mui/material/colors";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { SessionListPage } from "./pages/SessionListPage";

if (process.env.NODE_ENV === "development") {
  const { worker } = await import("./mocks/browser");
  worker.start();
}

const theme = createTheme({
  palette: {
    primary: {
      main: grey[900],
    },
    secondary: {
      main: deepPurple[900],
    },
    background: {
      default: "#F5F5F5",
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
