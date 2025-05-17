import React from "react";
import { createRoot } from "react-dom/client";  // ← importar daqui
import "./index.css";
import Router from "./routes";

const container = document.getElementById("root");
if (!container) throw new Error("Elemento #root não encontrado");

const root = createRoot(container);               // ← criar o root
root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
