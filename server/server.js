const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// app.post("/refresh", (req, res) => {
//   const refreshToken = req.body.refreshToken;
//   const spotifyApi = new SpotifyWebApi({
//     clientId: "40b54d38e5504b77a233d1c02d045ac7",
//     clientSecret: "cf028a2166f940ec8ac668ff59a60e92",
//     redirectUri: "http://localhost:5173/callback",
//     refreshToken,
//   });

//   spotifyApi
//     .refreshAccessToken()
//     .then((data) => {
//       console.log(data.body);
//       // spotifyApi.setAccessToken(data.body["access_token"]);
//     })
//     .catch(() => {
//       res.sendStatus(401);
//     });
// });

app.post("/login", (req, res) => {
  const code = req.body.code;
  console.log(code);
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:5173/callback",
    clientId: "40b54d38e5504b77a233d1c02d045ac7",
    clientSecret: "cf028a2166f940ec8ac668ff59a60e92",
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      // console.log("something went wrong in server.js", err);
      res.sendStatus(400);
    });
});

app.listen(3001);
