import { Routes, Route } from "react-router";
import Login from "./features/auth/Login";
import Dashboard from "./containers/Dashboard";
import ProtectedRoute from "./layouts/ProtectedRoute";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { fetchUser } from "./app/slices/userSlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <Routes>
      <Route index element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
