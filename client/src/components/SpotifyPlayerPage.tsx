import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("player page mounted");

    const token = localStorage.getItem("spotifyAccessToken");
    console.log("access token found in player.tsx: ", token);

    if (!token) {
      console.error("no access token found");
      navigate("/login");
      return;
    }

    spotifyApi.setAccessToken(token);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    // const script = document.createElement("script");
    // script.src = "https://sdk.scdn.co/spotify-player-js";
    // script.async = true;
    // document.body.appendChild(script);

    const scriptId = "spotify-sdk";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const playerInstance = new window.Spotify.Player({
        name: "My custom spotify player",
        getOAuthToken: (cb: (token: string) => void) => {
          const freshToken = localStorage.getItem("spotifyAccessToken");
          if (freshToken) {
            cb(freshToken);
          } else {
            console.error("no token found in getOAuthToken");
          }
        },
        volume: 0.5,
      });

      setPlayer(playerInstance);

      playerInstance.addListener("ready", (event: { device_id: string }) => {
        console.log("Ready with device ID", event.device_id);
        setDeviceId(event.device_id);

        spotifyApi.transferMyPlayback([event.device_id]).then(() => {
          console.log("playback transferred to web player");
        });
      });

      playerInstance.connect().then((success: boolean) => {
        if (success) {
          console.log("spotify connected successfully");
          setLoading(false);
        } else {
          console.error("spotify failed to connect");
        }
      });

      return () => {
        const script = document.getElementById(scriptId);
        if (script) {
          document.body.removeChild(script);
        }
      };
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

  if (loading) {
    return (
      <p className="text-white text-center mt-10">Loading spotify player... </p>
    );
  }

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
