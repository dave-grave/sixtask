const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:5173/callback",
    clientId: "40b54d38e5504b77a233d1c02d045ac7",
    clientSecret: "cf028a2166f940ec8ac668ff59a60e92",
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      console.log(data.body);
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expiresIn,
      });
      spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(() => {
      res.sendStatus(400);
    });
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:5173/callback",
    clientId: "40b54d38e5504b77a233d1c02d045ac7",
    clientSecret: "cf028a2166f940ec8ac668ff59a60e92",
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      console.log(data.body);
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in, // 10
      });
    })
    .catch((err) => {
      console.log("server.js /login error ", err);
      res.sendStatus(400);
    });
});

app.listen(3001);
