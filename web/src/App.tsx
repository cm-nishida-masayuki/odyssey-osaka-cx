<<<<<<< Updated upstream
import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const SamplePage = lazy(() => import("./pages/Sample"));
=======
import {
  CssBaseline,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { deepPurple, grey } from "@mui/material/colors";
import Header from "./components/Header";
import BreakItem from "./components/SessionView/BreakList";
import SessionListItem from "./components/SessionView/SessionItem";
import SessionList from "./components/SessionView/SessionList";
import TimeBorder from "./components/SessionView/TimeBorder";

const App = () => {
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
>>>>>>> Stashed changes

export const App = () => {
  return (
<<<<<<< Updated upstream
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SamplePage />} />
      </Routes>
    </BrowserRouter>
  );
};
=======
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Typography
        variant="h6"
        sx={{
          fontSize: "24px",
          fontWeight: "bold",
          margin: "12px 16px",
        }}
      >
        セッション
      </Typography>
      <SessionList>
        <TimeBorder time="11:00" />
        <SessionListItem
          title="セッションのタイトルが入ります。長い可能性があります。"
          speaker={`クラスメソッド株式会社製造\nビジネステクノロジー部 山田 太郎`}
        />
        <TimeBorder time="11:50" />
        <BreakItem />
        <TimeBorder time="12:00" />
        <SessionListItem
          title="セッションのタイトルが入ります。長い可能性があります。"
          speaker={`クラスメソッド株式会社製造\nビジネステクノロジー部 山田 太郎`}
        />
        <TimeBorder time="12:50" />
        <BreakItem />
        <TimeBorder time="13:00" />
      </SessionList>
    </ThemeProvider>
  );
};

>>>>>>> Stashed changes
export default App;
