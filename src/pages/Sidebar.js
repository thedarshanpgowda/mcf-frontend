import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuthContext } from "../context/AuthContext"; // Adjust the path as needed
import { IoIosLogOut } from "react-icons/io";

const Sidebar = () => {
  const { authUser, setAuthUser } = useAuthContext();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("level-1");
    localStorage.removeItem("level-2");

    // Clear authUser in context
    setAuthUser(null);

    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <h1>DRC monitor</h1>
      {/* {authUser && (
        <div className="user-info">
          <p className="username">{authUser.email}</p>
        </div>
      )} */}
      <ul className="sidebar-list">
        <li>
          <Link to="/" className="sidebar-link">
            Home
          </Link>
        </li>
        {authUser?.level === 2 && (
          <>
            <li>
              <Link to="/admin" className="sidebar-link">
                Admin
              </Link>
            </li>
            <li>
              <Link to="/history" className="sidebar-link">
                History
              </Link>
            </li>
          </>
        )}
      </ul>
      <IoIosLogOut className="logout" onClick={handleLogout} />
    </div>
  );
};

export default Sidebar;
