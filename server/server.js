require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// handle POSTs to /login
app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    // pass in hidden environment variables to the spotifyApi object
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  spotifyApi
    .authorizationCodeGrant(code)
    // communicate with spotifyApi endpoint
    .then((data) => {
      console.log(data.body);
      // response consists of data, access the auth token parameters
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      // catch server-side errors
      console.log("server.js /login error ", err);
      res.sendStatus(400);
    });
});

// handle POSTs to /refresh
app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    // same as before, but also pass in the current refreshToken
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      console.log(data.body);
      res.json({
        // spotify endpoint responds with updated accessToken and expiresIn
        accessToken: data.body.access_token,
        expiresIn: data.body.expiresIn,
      });
      spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(() => {
      res.sendStatus(400);
    });
});

// listen on local port 3001
// this requires us to send any POST commands to localhost:3001
app.listen(3001);
