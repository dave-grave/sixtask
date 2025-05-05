import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function useAuth(code: string) {
  // spotify authentication requires accessToken, refreshToken, and expiresIn counter
  const [accessToken, setAccessToken] = useState<string>();
  const [refreshToken, setRefreshToken] = useState<string>();
  const [expiresIn, setExpiresIn] = useState<number>();

  const loginHasRun = useRef(false);

  useEffect(() => {
    // if logged in already, prevent a second call to accessToken
    if (loginHasRun.current) return;
    loginHasRun.current = true;

    // post code to /login on server.js
    axios
      .post("http://localhost:3001/login", {
        code,
      })
      .then((res) => {
        console.log("useauth.tsx /login access token", res.data);

        // set auth parameters through res.data
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        window.history.pushState({}, "", "/");
      })
      .catch((err) => {
        console.log("useauth.tsx /login POST error", err);
        // window.location.href = "/";
      });

    // runs when the code mounts, it doesn't exist prior to running this useEffect
  }, [code]);

  useEffect(() => {
    // prevent POST error when refreshToken doesn't exist
    if (!refreshToken || !expiresIn) {
      // console.log("no refresh token yet, returning.");
      return;
    }

    // keep timer of expiresIn to refresh the token periodically
    const interval = setInterval(() => {
      axios
        .post("http://localhost:3001/refresh", {
          refreshToken,
        })
        .then((res) => {
          console.log("useauth.tsx /refresh access token", res.data);

          // only need to update accessToken and expiresIn values
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
          window.history.pushState({}, "", "/");
        })
        .catch((err) => {
          console.log("useauth.tsx /refresh POST error", err);
          // window.location.href = "/";
        });
    }, (expiresIn - 60) * 1000);

    // reset the timer
    return () => clearInterval(interval);

    // useEffect only runs when the refreshToken or expiresIn changes
  }, [refreshToken, expiresIn]);

  return accessToken;
}
