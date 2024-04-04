import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import "./index.scss";
import Stuffs from "./features/stuffs/Stuffs";
import Stats from "./features/stats/Stats";
import UpdateStuff from "./features/stuffs/UpdateStuff";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Navigate to="/stuffs" replace />} />
        <Route path="stuffs" element={<Stuffs />}>
          <Route path=":stuffId" element={<UpdateStuff />} />
        </Route>
        <Route path="stats" element={<Stats />} />
      </Route>
    </Routes>
  </BrowserRouter>
  // </StrictMode>
);
