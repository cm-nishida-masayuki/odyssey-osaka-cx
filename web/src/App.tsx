import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const SamplePage = lazy(() => import("./pages/Sample"));

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SamplePage />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
