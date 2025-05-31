"use client";
import React, { useEffect } from "react";
import { useSpotifyContext } from "@/app/context/SpotifyContext";
import SpotifyPlayer from "./SpotifyPlayer";

export default function Spotify() {
  const { profile, devices, getProfile, authUrl, spotifyToken } =
    useSpotifyContext();

  useEffect(() => {
    getProfile();
    console.log(devices);
  }, []);

  return (
    <div>
      <a href={authUrl}>connect with spotify</a>
      {profile ? <pre>{JSON.stringify(profile, null, 2)}</pre> : <p>loading</p>}
      <SpotifyPlayer token={spotifyToken} />
    </div>
  );
}
