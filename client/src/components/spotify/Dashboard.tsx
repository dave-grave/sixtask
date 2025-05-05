import { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import useAuth from "./useAuth";
import TrackSearchResult from "./TrackSearchResult";
import Player from "./Player";

// create spotifyApi object with clientId
const spotifyApi = new SpotifyWebApi({
  clientId: "40b54d38e5504b77a233d1c02d045ac7",
});

export default function Dashboard({ code }: { code: any }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState<any>();

  function chooseTrack(track: any) {
    setPlayingTrack(track);
    setSearch("");
  }

  // set accessToken if it exists
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    // check for an empty search or if accessToken exists
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    // keep track of if setSearchResults has finished or not.
    // if it is not finished this prevents us from calling it again.
    let cancel = false;

    spotifyApi.searchTracks(search).then((res: any) => {
      if (cancel) return;

      // find smallest album image to use in search results
      setSearchResults(
        res.body.tracks.items.map((track: any) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest: any, image: any) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });
    return () => {
      cancel = true;
    };

    // runs whenever we search for a different song or when accessToken exists
  }, [search, accessToken]);

  return (
    <div>
      <Container
        className="d-flex flex-column py-2"
        style={{ height: "100vh" }}
      >
        <Form.Control
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
          {searchResults.map((track: any) => (
            // display searchResults
            <TrackSearchResult
              track={track}
              key={track.uri} // each track is uniquely identified by its uri
              chooseTrack={chooseTrack}
            />
          ))}
        </div>
        <div>
          {/* display the player UI */}
          <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
        </div>
      </Container>
    </div>
  );
}
