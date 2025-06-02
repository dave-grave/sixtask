import React, { useEffect, useRef, useState } from "react";
export default function SpotifyPlayer({ token }: { token: string | null }) {
  const playerRef = useRef<any>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(true);

  const [playlists, setPlaylists] = useState<{ name: string; uri: string }[]>(
    []
  );
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

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
        // console.log("device is ready", device_id);
      });

      player.addListener("player_state_changed", (state: any) => {
        setIsPaused(state.paused);
        setCurrentTrack(state.track_window.current_track?.name ?? null);
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
      window.onSpotifyWebPlaybackSDKReady();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
        playerRef.current = null;
      }
    };
  }, [token]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const res = await fetch(
        "https://api.spotify.com/v1/me/playlists?limit=50",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.items) {
        setPlaylists(
          data.items.map((pl: any) => ({
            name: pl.name,
            uri: pl.uri,
          }))
        );
        setSelectedPlaylist(data.items[0]?.uri ?? null);
      }
    };
    fetchPlaylists();
  }, [token]);

  const playSong = async () => {
    if (!deviceId || !token || !selectedPlaylist)
      return alert("player not ready");

    await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context_uri: selectedPlaylist,
          offset: { position: 0 },
        }),
      }
    );
  };

  const pauseSong = async () => {
    if (!deviceId || !token) return;
    await fetch(
      `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const resumeSong = async () => {
    if (!deviceId || !token) return;
    await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  };

  const skipNext = async () => {
    if (!deviceId || !token) return;

    await fetch(
      `https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const skipPrevious = async () => {
    if (!deviceId || !token) return;
    await fetch(
      `https://api.spotify.com/v1/me/player/previous?device_id=${deviceId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        className="bg-green-600 rounded px-4 py-2 transition hover:bg-green-800 disabled:bg-gray-200"
        onClick={playSong}
        disabled={!deviceId || !token}
      >
        play song
      </button>
      {playlists.length > 0 && (
        <select
          className="mb-2 p-2 rounded border"
          value={selectedPlaylist ?? ""}
          onChange={(e) => setSelectedPlaylist(e.target.value)}
        >
          {playlists.map((pl) => (
            <option key={pl.uri} value={pl.uri}>
              {pl.name}
            </option>
          ))}
        </select>
      )}
      <button
        className="bg-yellow-600 text-white disabled:text-black rounded px-4 py-2 transition hover:bg-yellow-800 disabled:cursor-not-allowed disabled:bg-gray-200"
        onClick={pauseSong}
        disabled={!deviceId || !token || isPaused}
      >
        Pause
      </button>
      <button
        className="bg-blue-600 text-white disabled:text-black rounded px-4 py-2 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-200"
        onClick={resumeSong}
        disabled={!deviceId || !token || !isPaused}
      >
        Resume
      </button>
      <div className="flex gap-2">
        <button
          className="bg-gray-400 rounded px-2 py-1 transition hover:bg-gray-600"
          onClick={skipPrevious}
          disabled={!deviceId || !token}
        >
          ⏮ Prev
        </button>
        <button
          className="bg-gray-500 rounded px-2 py-1 transition hover:bg-gray-700"
          onClick={skipNext}
          disabled={!deviceId || !token}
        >
          Next ⏭
        </button>
      </div>
      {deviceId && (
        <div>
          <div>Ready to Play!</div>
        </div>
      )}
    </div>
  );
}
