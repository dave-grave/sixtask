import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <div>
      <h1 className="text-3xl font-bold underline">hello world</h1>
    </div>
  </StrictMode>
);
