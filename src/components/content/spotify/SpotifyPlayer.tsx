import React, { useEffect, useRef, useState } from "react";

export default function SpotifyPlayer({ token }: { token: string | null }) {
  const playerRef = useRef<any>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Wait until the SDK script is loaded
      if (window.Spotify) {
        window.onSpotifyWebPlaybackSDKReady = () => {
          const player = new window.Spotify.Player({
            name: "sixtask web player",
            getOAuthToken: (cb: (token: string | null) => void) => {
              cb(token);
            },
            volume: 0.5,
          });

          // add listener to deviceId
          player.addListener(
            "ready",
            ({ device_id }: { device_id: string }) => {
              setDeviceId(device_id);
              console.log("device is ready", device_id);
            }
          );

          // connect player to web playback
          playerRef.current = player;
          player.connect();
          console.log(player);
        };

        // If SDK is already ready, call the handler immediately
        if (window.onSpotifyWebPlaybackSDKReady) {
          window.onSpotifyWebPlaybackSDKReady();
        }
        clearInterval(interval);
      }
    }, 100);
    return () => {
      clearInterval(interval);
      if (playerRef.current) {
        playerRef.current.disconnect();
        playerRef.current = null;
      }
    };
  }, [token]);

  const playSong = async () => {
    if (!deviceId || !token) return alert("player not ready");

    await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: ["spotify:track:11dFghVXANMlKmJXsNCbNl"],
        }),
      }
    );
  };

  return (
    <div>
      <button
        className="bg-green-600 rounded px-4 py-2 transition hover:bg-green-800"
        onClick={playSong}
        disabled={!deviceId || !token}
      >
        play song
      </button>
      {deviceId && <div>Web Player Device ID: {deviceId}</div>}
    </div>
  );
}
