"use client";
import React, { useEffect } from "react";
import { useSpotifyContext } from "@/app/context/SpotifyContext";
import SpotifyPlayer from "./SpotifyPlayer";

export default function Spotify() {
  const { getProfile, authUrl, spotifyToken, logoutSpotify } =
    useSpotifyContext();

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="flex flex-col items-center">
      {spotifyToken ? (
        <SpotifyPlayer token={spotifyToken} />
      ) : (
        <a href={authUrl}>
          <button className="bg-green-500 rounded px-4 py-2">
            {" "}
            connect with spotify
          </button>
        </a>
      )}
      {spotifyToken ? (
        <button
          className="bg-red-500 rounded px-4 py-2"
          onClick={logoutSpotify}
        >
          Log out of Spotify
        </button>
      ) : (
        <></>
      )}
      <p>
        Note: spotify only works if you are on the web and have a premium
        account LOL
      </p>
    </div>
  );
}
