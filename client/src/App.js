import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login";
import Dashboard from "./Dashboard";
import NavBar from "./Navbar"; // Import the NavBar component
import { Route, Routes } from "react-router-dom";
const code = new URLSearchParams(window.location.search).get("code");

function App() {
  return (
    <>
      <NavBar /> {/* Add the NavBar component */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard code={code} />} />
        {/* Add more routes as needed */}
      </Routes>
    </>
  );
}

export default App;
