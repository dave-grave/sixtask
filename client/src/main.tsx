import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TimerProvider } from "./components/context/TimerContext.tsx";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div>
      <TimerProvider>
        <App />
      </TimerProvider>
    </div>
  </StrictMode>
);
