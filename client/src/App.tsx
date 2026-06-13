import { Routes, Route, Outlet } from "react-router";
import Login from "./containers/auth/Login";
import Dashboard from "./containers/Dashboard";
import ProtectedRoute from "./layouts/ProtectedRoute";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { fetchUser } from "./app/slices/userSlice";
import WithSidebar from "./layouts/WithSidebar";
import Inventory from "./containers/Inventory/Inventory";
import Events from "./containers/Events/EventsDashboard/Events";
import Clients from "./containers/Clients/Clients";
import Team from "./containers/Team/Team";
import ToastProvider from "./context/ToastProvider";
import ResidentialClient from "./containers/Clients/ResidentialClient/ResidentialClient";
import Library from "./containers/Library/Library";
import Vendors from "./containers/Vendors/Vendors";
import CreateEvent from "./containers/Events/CreateEvent/CreateEvent";
import { CreateEventProvider } from "./containers/Events/context/CreateEventProvider";
import EventDetails from "./containers/Events/EventDetails/EventDetails";
import { EventDetailsProvider } from "./containers/Events/context/EventDetailsProvider";
import { BillingProvider } from "./containers/Events/context/BillingProvider";
import { useLocation } from "react-router";
import NavigationHandler from "./components/common/NavigationHandler";
import InventorySettings from "./containers/Inventory/InventorySettings/InventorySettings";
import ItemDetails from "./containers/Inventory/InventoryDetails/ItemDetails";
import Logistics from "./containers/Logistics/Logistics";

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <ToastProvider>
      <NavigationHandler />
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
          <Route path="/inventory" element={<Outlet />}>
            <Route index element={<Inventory />} />
            <Route path="settings" element={<InventorySettings />} />
            <Route path=":uid" element={<ItemDetails />} />
          </Route>
          <Route path="/events" element={<Outlet />}>
            <Route
              index
              element={
                <CreateEventProvider>
                  <Events />
                </CreateEventProvider>
              }
            />
            <Route
              path="create"
              element={
                <BillingProvider key={location.pathname}>
                  <CreateEventProvider>
                    <CreateEvent />
                  </CreateEventProvider>
                </BillingProvider>
              }
            />
            <Route
              path=":eventUid"
              element={
                <BillingProvider key={location.pathname}>
                  <EventDetailsProvider>
                    <EventDetails />
                  </EventDetailsProvider>
                </BillingProvider>
              }
            />
          </Route>
          <Route path="/clients">
            <Route index element={<Clients />} />
            <Route path=":uid" element={<ResidentialClient />} />
          </Route>
          <Route path="/logistics" element={<Logistics />}></Route>
          <Route path="/team" element={<Team />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/library" element={<Library />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}

export default App;
