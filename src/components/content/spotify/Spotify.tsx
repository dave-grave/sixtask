"use client";
import React, { useEffect } from "react";
import { useSpotifyContext } from "@/app/context/SpotifyContext";
import SpotifyPlayer from "./SpotifyPlayer";

export default function Spotify() {
  const { profile, devices, getProfile, authUrl, spotifyToken } =
    useSpotifyContext();

  useEffect(() => {
    getProfile();
    // console.log(devices);
  }, []);

  return (
    <div className="flex flex-col items-center">
      {spotifyToken ? (
        <SpotifyPlayer token={spotifyToken} />
      ) : (
        <a href={authUrl}>connect with spotify</a>
      )}
      <p>
        Note: spotify only works if you are on the web and have a premium
        account LOL
      </p>
    </div>
  );
}
