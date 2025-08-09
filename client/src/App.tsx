import { Routes, Route } from "react-router";
import Login from "./features/auth/Login";
import Dashboard from "./containers/Dashboard";
import ProtectedRoute from "./layouts/ProtectedRoute";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { fetchUser } from "./app/slices/userSlice";
import WithSidebar from "./layouts/WithSidebar";
import Inventory from "./containers/Inventory";
import Events from "./containers/Events";
import Clients from "./containers/Clients";
import Team from "./containers/Team/Team";
import ToastProvider from "./context/ToastProvider";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <ToastProvider>
      <Routes>
        <Route index element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <WithSidebar />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/events" element={<Events />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/team" element={<Team />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}

export default App;
