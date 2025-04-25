import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function useAuth(code: string) {
  const [accessToken, setAccessToken] = useState<string>();
  const [refreshToken, setRefreshToken] = useState<string>();
  const [expiresIn, setExpiresIn] = useState<string>();

  const loginHasRun = useRef(false);
  const refreshHasRun = useRef(false);

  useEffect(() => {
    if (loginHasRun.current) return;
    loginHasRun.current = true;

    axios
      .post("http://localhost:3001/login", {
        code,
      })
      .then((res) => {
        console.log("/login access token", res.data);
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        window.history.pushState({}, "", "/");
      })
      .catch((err) => {
        console.log("/login POST error", err);
        window.location.href = "/";
      });
  }, [code]);

  useEffect(() => {
    if (refreshHasRun.current) return;
    refreshHasRun.current = true;

    if (!refreshToken) {
      console.log("no refresh token yet");
      return;
    }

    axios
      .post("http://localhost:3001/refresh", {
        refreshToken,
      })
      .then((res) => {
        console.log("/refresh access token", res.data);
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        // window.history.pushState({}, "", "/");
      })
      .catch((err) => {
        console.log("/refresh POST error", err);
        // window.location.href = "/";
      });
  }, [refreshToken, expiresIn]);

  return accessToken;
}
