import { useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

// displays the spotify player on screen.
// requires an accessToken and trackUri.
export default function Player({ accessToken, trackUri }: any) {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    setPlay(true);
  }, [trackUri]);

  if (!accessToken) return null;

  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={(state) => {
        if (!state.isPlaying) setPlay(false);
      }}
      play={play}
      uris={trackUri ? [trackUri] : []}
    />
  );
}
