import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");

    console.log("Callback URL Hash: ", hash);

    if (accessToken) {
      console.log("access token found in callback.tsx:", accessToken);
      localStorage.setItem("spotifyAccessToken", accessToken);

      setTimeout(() => {
        console.log("navigating to spotify");
        navigate("/spotify");
      }, 300);
    } else {
      console.error("No access token found in URL");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <p className="text-white text-center mt-10">
      Authenticating with spotify...
    </p>
  );
};

export default Callback;
