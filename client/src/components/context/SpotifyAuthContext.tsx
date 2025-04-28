import { createContext, useContext, useEffect, useState } from "react";

interface SpotifyAuthContextProps {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  refreshToken: string | null;
  setRefreshToken: (token: string) => void;
  expiresIn: number | null;
  setExpiresIn: (time: number) => void;
}

const SpotifyAuthContext = createContext<SpotifyAuthContextProps | undefined>(
  undefined
);

export const SpotifyAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedExpiresIn = localStorage.getItem("expiresIn");

    if (storedAccessToken) setAccessToken(storedAccessToken);
    if (storedRefreshToken) setRefreshToken(storedRefreshToken);
    if (storedExpiresIn) setExpiresIn(Number(storedExpiresIn));
  }, []);

  useEffect(() => {
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    if (expiresIn) localStorage.setItem("expiresIn", expiresIn.toString());
  }, [accessToken, refreshToken, expiresIn]);

  return (
    <SpotifyAuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        expiresIn,
        setExpiresIn,
      }}
    >
      {children}
    </SpotifyAuthContext.Provider>
  );
};

export const useSpotifyAuth = () => {
  const context = useContext(SpotifyAuthContext);
  if (!context) {
    throw new Error("useSpotifyAuth must be used within SpotifyAuthProvider");
  }
  console.log(context);
  return context;
};
