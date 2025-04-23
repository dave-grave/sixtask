import Login from "./Login";
import Dashboard from "./Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  // const [token, setToken] = useState<string | null>(
  //   localStorage.getItem("spotifyAccessToken")
  // );

  // useEffect(() => {
  //   const checkToken = () => {
  //     const storedToken = localStorage.getItem("spotifyAccessToken");
  //     setToken(storedToken);
  //   };

  //   checkToken();

  //   window.addEventListener("storage", checkToken);

  //   return () => {
  //     window.removeEventListener("storage", checkToken);
  //   };
  // }, []);

  const code = new URLSearchParams(window.location.search).get("code");

  return code ? <Dashboard code={code} /> : <Login />;
  // return <Login />;
}

export default App;
