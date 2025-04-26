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
