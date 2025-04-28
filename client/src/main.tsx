import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TimerProvider } from "./components/context/TimerContext.tsx";
import { SpotifyAuthProvider } from "./components/context/SpotifyAuthContext.tsx";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div>
      <SpotifyAuthProvider>
        <TimerProvider>
          <App />
        </TimerProvider>
      </SpotifyAuthProvider>
    </div>
  </StrictMode>
);
