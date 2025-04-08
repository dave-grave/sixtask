import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

const spotifyApi = new SpotifyWebApi();

const SpotifyPlayerPage = () => {
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("spotifyAccessToken");
    if (!token) {
      console.error("no access token found");
      return;
    }

    spotifyApi.setAccessToken(token);

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player-js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const playerInstance = new window.Spotify.Player({
        name: "My custom spotify player",
        getOAuthToken: (cb: (token: string) => void) => cb(token),
        volume: 0.5,
      });

      setPlayer(playerInstance);

      playerInstance.addListener("ready", (event: { device_id: string }) => {
        console.log("Ready with device ID", event.device_id);
        setDeviceId(event.device_id);
      });

      playerInstance.connect();
    };
  }, []);

  const handlePlay = async () => {
    if (!deviceId) return;
    await spotifyApi.play({
      device_id: deviceId,
      uris: ["spotify:track:YOUR_TRACK_URI"],
    });
    setIsPlaying(true);
  };

  const handlePause = async () => {
    if (!deviceId) return;

    await spotifyApi.pause({ device_id: deviceId });
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-4">Spotify player</h2>
      <div className="flex space-x-4">
        <button
          onClick={handlePlay}
          className="px-6 py-3 bg-green-500 rounded-lg shadow-md text-lg 
          font-semibold hover:bg-green-600 transition duration-200"
        >
          Play
        </button>

        <button
          onClick={handlePause}
          className="px-6 py-3 bg-red-500 rounded-lg shadow-md text-lg 
            font-semibold hover:bg-red-600 transition duration-200"
        >
          Pause
        </button>
      </div>
    </div>
  );
};

export default SpotifyPlayerPage;
