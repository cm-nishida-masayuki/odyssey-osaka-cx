import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { QuestionnaireListPage } from "./pages/QuestionnaireListPage";
import { SessionDetailsPage } from "./pages/SessionDetailsPage";

if (process.env.NODE_ENV === "development") {
  const { worker } = await import("./mocks/browser");
  worker.start();
}

const theme = createTheme({
  palette: {
    primary: {
      main: "rgba(33, 33, 33, 1)",
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
            <Route path="/session" element={<SessionListPage />}></Route>
          </Route>
          <Route path="/session/:id" element={<RootLayout />}>
            <Route index element={<SessionDetailsPage />} />
          </Route>
          <Route path="/questionnaire" element={<RootLayout />}>
            <Route index element={<QuestionnaireListPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
