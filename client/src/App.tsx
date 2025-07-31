import { Routes, Route } from "react-router";
import Login from "./features/auth/Login";
import Dashboard from "./containers/Dashboard";

function App() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
