import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/map" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
