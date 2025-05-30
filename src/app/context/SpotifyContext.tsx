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

  const scopes = ["user-read-private, user-read-email"].join("");
  const authUrl =
    `https://accounts.spotify.com/authorize?` +
    `client_id=${encodeURIComponent(SPOTIFY_CLIENT_ID)}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(scopes)}`;

  const getProfile = async () => {
    if (!user) return; // fetch only if user is authenticated
    const { data, error } = await supabase
      .from("spotify_tokens")
      .select("access_token")
      .eq("user_id", user.id)
      .single();
    if (!data?.access_token) return;

    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: "Bearer " + data.access_token },
    });
    if (response.ok) setProfile(await response.json());

    window.location.replace("/home");
  };

  return (
    <SpotifyContext.Provider value={{ profile, getProfile, authUrl }}>
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
