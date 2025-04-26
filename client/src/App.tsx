import Login from "./Login";
import Dashboard from "./Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const code = new URLSearchParams(window.location.search).get("code");

  return code ? <Dashboard code={code} /> : <Login />;
  // return <Login />;
}

export default App;
