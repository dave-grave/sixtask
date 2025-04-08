import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));

    const accessToken = params.get("access_token");

    if (accessToken) {
      localStorage.setItem("spotifyAccesToken", accessToken);
      navigate("/spotify");
    } else {
      console.error("No access token found in URL");
      navigate("/");
    }
  }, [navigate]);

  return (
    <p className="text-white text-center mt-10">
      Authenticating with spotify...
    </p>
  );
};

export default Callback;
