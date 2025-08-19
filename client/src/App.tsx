import { Routes, Route } from "react-router";
import Login from "./features/auth/Login";
import Dashboard from "./containers/Dashboard";
import ProtectedRoute from "./layouts/ProtectedRoute";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { fetchUser } from "./app/slices/userSlice";
import WithSidebar from "./layouts/WithSidebar";
import Inventory from "./containers/Inventory/Inventory";
import Events from "./containers/Events";
import Clients from "./containers/Clients/Clients";
import Team from "./containers/Team/Team";
import ToastProvider from "./context/ToastProvider";
import ResidentialClient from "./containers/Clients/ResidentialClient";
import Library from "./containers/Library/Library";
import Vendors from "./containers/Vendors/Vendors";

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
          <Route path="/clients">
            <Route index element={<Clients />} />
            <Route path=":uid" element={<ResidentialClient />} />
          </Route>

          <Route path="/team" element={<Team />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/library" element={<Library />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}

export default App;
