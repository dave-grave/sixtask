import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function useAuth(code: string) {
  const [accessToken, setAccessToken] = useState<string>();
  const [refreshToken, setRefreshToken] = useState<string>();
  const [expiresIn, setExpiresIn] = useState<number>();

  const loginHasRun = useRef(false);
  // const refreshHasRun = useRef(false);

  useEffect(() => {
    if (loginHasRun.current) return;
    loginHasRun.current = true;

    axios
      .post("http://localhost:3001/login", {
        code,
      })
      .then((res) => {
        console.log("useauth.tsx /login access token", res.data);
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        window.history.pushState({}, "", "/");
      })
      .catch((err) => {
        console.log("useauth.tsx /login POST error", err);
        // window.location.href = "/";
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) {
      // console.log("no refresh token yet, returning.");
      return;
    }

    const interval = setInterval(() => {
      axios
        .post("http://localhost:3001/refresh", {
          refreshToken,
        })
        .then((res) => {
          console.log("useauth.tsx /refresh access token", res.data);
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
          window.history.pushState({}, "", "/");
        })
        .catch((err) => {
          console.log("useauth.tsx /refresh POST error", err);
          // window.location.href = "/";
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
