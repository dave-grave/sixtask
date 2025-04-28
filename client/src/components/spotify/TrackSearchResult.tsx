export default function TrackSearchResult({
  track,
  chooseTrack,
}: {
  track: any;
  chooseTrack: (track: any) => void;
}) {
  function handlePlay() {
    chooseTrack(track);
  }

  return (
    <div
      className="flex m-2 align-center"
      style={{ cursor: "pointer" }}
      onClick={handlePlay}
    >
      <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} />
      <div className="ml-3">
        <div>{track.title}</div>
        <div className="font-bold italic"> {track.artist} </div>
      </div>
    </div>
  );
}
