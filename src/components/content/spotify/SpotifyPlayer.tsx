import React, { useEffect, useRef, useState } from "react";

export default function SpotifyPlayer({ token }: { token: string | null }) {
  const playerRef = useRef<any>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "sixtask web player",
        getOAuthToken: (cb: (token: string | null) => void) => {
          cb(token);
        },
        volume: 0.5,
      });

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        setDeviceId(device_id);
        console.log("device is ready", device_id);
      });

      playerRef.current = player;
      player.connect();
    };

    if (!document.getElementById("spotify-player-script")) {
      const script = document.createElement("script");
      script.id = "spotify-player-script";
      script.type = "text/javascript";
      script.async = true;
      script.src = "https://sdk.scdn.co/spotify-player.js";
      document.body.appendChild(script);
    } else if (window.Spotify && window.onSpotifyWebPlaybackSDKReady) {
      // If script is already loaded, call the handler immediately
      window.onSpotifyWebPlaybackSDKReady();
    }

    return () => {
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
    <div className="flex flex-col items-center gap-2">
      {/* <Script
        src="https://sdk.scdn.co/spotify-player.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      ></Script> */}
      <button
        className="bg-green-600 rounded px-4 py-2 transition hover:bg-green-800"
        onClick={playSong}
        disabled={!deviceId || !token}
      >
        play song
      </button>
      {deviceId && (
        <div>
          <div>Ready to Play!</div>
        </div>
      )}
    </div>
  );
}
