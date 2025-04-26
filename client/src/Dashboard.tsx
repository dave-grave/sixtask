import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import TrackSearchResult from "./TrackSearchResult";

const spotifyApi = new SpotifyWebApi({
  clientId: "40b54d38e5504b77a233d1c02d045ac7",
});

export default function Dashboard({ code }: { code: any }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState<string>("");
  const [searchResults, setSearchResults] = useState([]);
  // console.log(searchResults);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then((res: any) => {
      // console.log(res.body);
      // console.log(res.body.tracks.items);
      if (cancel) return;

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
  }, [search, accessToken]);

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <Form.Control
        type="search"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {searchResults.map((track: any) => (
          <TrackSearchResult track={track} key={track.uri} />
        ))}
      </div>
      <div>Bottom</div>
    </Container>
  );
}
