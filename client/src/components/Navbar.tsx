import * as React from "react";
import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, removeToken } from "../utils/auth";
import ProfileMenu from "./ProfileMenu";

const Navbar: React.FC = () => {
    const user = getUser();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
  
    const handleLogout = () => {
      removeToken();
      navigate("/signin");
    };
  
    return (
      <nav className="bg-gray-700 text-white flex justify-between items-center px-6 py-3">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/landing")}
        >
          🎬 FaveFlix
        </h1>
  
        <div className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-lg"
          >
            {user?.username ? user.username[0].toUpperCase() : "U"}
          </button>
  
          {open && (
            <ProfileMenu
              user={user}
              onLogout={handleLogout}
              onDashboard={() => navigate("/dashboard")}
            />
          )}
        </div>
      </nav>
    );
  };
  
  export default Navbar;