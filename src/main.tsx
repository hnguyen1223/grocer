import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import "./index.scss";
import Stuffs from "./features/stuffs/Stuffs";
import { StrictMode } from "react";
import Stats from "./features/stats/Stats";
window.addEventListener("resize", () => {
  // For the rare legacy browsers that don't support it
  if (!window.visualViewport) {
    return;
  }

  console.log(window.visualViewport.height);
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="/stuffs" replace />} />
          <Route path="stuffs" element={<Stuffs />} />
          <Route path="stats" element={<Stats />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
