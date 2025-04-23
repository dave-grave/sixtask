// const Login = () => {
//   const handleSpotifyLogin = () => {
//     const clientId = "40b54d38e5504b77a233d1c02d045ac7";
//     const redirectUri = "http://localhost:5173/callback";
//     const scopes = [
//       "streaming",
//       "user-read-playback-state",
//       "user-modify-playback-state",
//       "user-read-currently-playing",
//     ];

//     const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
//       redirectUri
//     )}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;

//     window.location.href = authUrl;
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
//       <h1 className="text-3xl font-bold mb-6">login to spotify</h1>
//       <button
//         onClick={handleSpotifyLogin}
//         className="px-6 py-3 bg-green-500 rounded-lg
//         shadow-md text-lg font-semibold hover:bg-green-600 transition duration-200"
//       >
//         Connect Spotify
//       </button>
//     </div>
//   );
// };

// export default Login;

import React from "react";

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=40b54d38e5504b77a233d1c02d045ac7&response_type=code&redirect_uri=http://localhost:5173/callback&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

export default function Login() {
  return (
    <div className="flex justify-center">
      <a href={AUTH_URL}>
        <button className="bg-green-500 hover:bg-green-700 text-black font-bold py-2 px-4 rounded shadow">
          login with spotify
        </button>
      </a>
    </div>
  );
}
