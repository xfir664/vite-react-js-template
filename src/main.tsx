import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./scss/index.scss";
import App from "./App";

// Гарантируем, что контейнер найден
const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element with id "root" not found');
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
