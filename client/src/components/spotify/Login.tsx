import Dashboard from "./Dashboard";

// consists of client_id, response_type, redirect_uri, and scopes
const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=40b54d38e5504b77a233d1c02d045ac7&response_type=code&redirect_uri=http://localhost:5173/callback&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

// redirect to spotify auth site when clicking button
export default function Login() {
  const code = new URLSearchParams(window.location.search).get("code");

  return (
    <div>
      {/* conditionally render dashboard if code exists */}
      {code ? (
        <Dashboard code={code} />
      ) : (
        <div className="flex justify-center">
          <a href={AUTH_URL}>
            <button className="bg-green-500 hover:bg-green-700 text-black font-bold py-2 px-4 rounded shadow">
              login with spotify
            </button>
          </a>
        </div>
      )}
    </div>
  );
}
