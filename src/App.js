import React from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import History from "./pages/History";
import Login from "./pages/Login";
import { useAuthContext } from "./context/AuthContext";
import {
  AuthenticatedRoute,
  UnauthenticatedRoute,
  Level2Route,
} from "./authorization/AuthGuard";
import Header from "./pages/Header";

const App = () => {
  const { authUser } = useAuthContext();
  const location = useLocation();
  const sidebarPaths = ["/", "/admin", "/history"]; // Pages that should show the sidebar

  // Determine initial redirect after login
  const initialRedirectPath = authUser?.level === 2 ? "/" : "/";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar only shows for logged-in users and on specified paths */}
      {sidebarPaths.includes(location.pathname) && authUser && <Sidebar />}

      {/* {sidebarPaths.includes(location.pathname) && authUser && <Header />} */}

      {/* Adjust main content area to give space for the fixed sidebar */}
      <div style={{ flex: 1, marginLeft: "17vw" }}>
        {sidebarPaths.includes(location.pathname) && authUser && <Header />}
        <Routes>
          {/* Unauthenticated users can only access the login page */}
          <Route element={<UnauthenticatedRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Authenticated users can access the following routes */}
          <Route element={<AuthenticatedRoute />}>
            <Route path="/" element={<Home />} />

            {/* Only Level-2 users can access Admin and History */}
            <Route element={<Level2Route />}>
              <Route path="/admin" element={<Admin />} />
              <Route path="/history" element={<History />} />
            </Route>
          </Route>

          {/* Redirect to appropriate page based on user level */}
          <Route
            path="/unauthorized"
            element={<Navigate to={initialRedirectPath} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
