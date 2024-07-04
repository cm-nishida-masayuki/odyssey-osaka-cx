import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

if (process.env.NODE_ENV === "development") {
  const { worker } = await import("./mocks/browser");
  worker.start();
}

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
