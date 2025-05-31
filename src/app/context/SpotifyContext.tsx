"use client";
import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { SpotifyContextType } from "@/types";
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from "@/lib/spotifyConfig";
import { supabase } from "@/lib/supabase";

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export function SpotifyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);

  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "streaming",
  ].join(" ");
  const authUrl =
    `https://accounts.spotify.com/authorize?` +
    `client_id=${encodeURIComponent(SPOTIFY_CLIENT_ID)}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(scopes)}`;

  const getProfile = async () => {
    // get Supabase JWT
    const { data } = await supabase.auth.getSession();
    const access_token = data.session?.access_token;
    if (!access_token) return;

    // call edge function to get spotify token
    const res = await fetch(
      "https://jnnnzjivyiuzekcqdgnh.functions.supabase.co/spotify-get-access-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const { access_token: token, devices } = await res.json();
    if (!token) return;

    const profileRes = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const profileData = await profileRes.json();
    setProfile(profileData);
    setSpotifyToken(token);
    setDevices(devices);
  };

  return (
    <SpotifyContext.Provider
      value={{ profile, devices, getProfile, authUrl, spotifyToken }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export function useSpotifyContext() {
  const ctx = useContext(SpotifyContext);
  if (!ctx) {
    throw new Error("useSpotifyContext must be used within a SpotifyProvider");
  }
  return ctx;
}
