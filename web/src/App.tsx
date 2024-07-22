import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { GenAIPage } from "./pages/GenAIPage";
import { HomePage } from "./pages/Home";
import { QuestionnaireAnswerPage } from "./pages/QuestionnaireAnswerPage";
import { QuestionnaireListPage } from "./pages/QuestionnaireListPage";
import { QuestionnairePage } from "./pages/QuestionnairePage";
import { SessionDetailsPage } from "./pages/SessionDetailsPage";
import { SessionListPage } from "./pages/SessionListPage";
import { DashboardPage } from "./pages/DashboardPage";

if (import.meta.env.VITE_IS_MOCK_API === "true") {
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
            <Route index element={<HomePage />} />
            <Route path="/session" element={<SessionListPage />} />
            <Route path="/session/:id" element={<SessionDetailsPage />} />
            <Route path="/questionnaire" element={<QuestionnaireListPage />} />
            <Route path="/questionnaire/:id" element={<QuestionnairePage />} />
            <Route path="/gen-ai" element={<GenAIPage />} />
            <Route
              path="/questionnaire/:id/answer"
              element={<QuestionnaireAnswerPage />}
            />
          </Route>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
