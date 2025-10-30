import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, removeToken } from "../utils/auth";
import ProfileMenu from "./ProfileMenu";

const Navbar: React.FC = () => {
  const user = getUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    navigate("/signin");
  };

  const goHome = () => navigate("/favorite");
  const goDashboard = () => navigate("/dashboard");

  return (
    <header className="w-full bg-[#141414] text-white sticky top-0 z-50 border-b border-black/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <button onClick={goHome} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-sm flex items-center justify-center shadow-md hover:scale-105 transition">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M3 3h3v18H3zM9 3h3v18H9zM15 3h3v18h-3z" />
              </svg>
            </div>
            <span className="text-xl font-extrabold">
              <span className="text-red-500">Fave</span>Flix
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={goHome}
              className="text-sm text-gray-300 hover:text-white"
            >
              Home
            </button>
            <button
              onClick={goDashboard}
              className="text-sm text-gray-300 hover:text-white"
            >
              Dashboard
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 hover:bg-white/10 rounded transition"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/10 transition"
            >
              <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center font-semibold">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="hidden sm:inline text-sm text-gray-200">
                {user?.username || "User"}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
                fill="currentColor"
              >
                <path d="M5.25 7.5L10 12.25 14.75 7.5z" />
              </svg>
            </button>

            {open && (
              <ProfileMenu
                user={user}
                onLogout={handleLogout}
                onDashboard={goDashboard}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile slide menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0b0b0b] border-t border-black/30">
          <div className="px-4 py-3 flex flex-col gap-2">
            <button
              onClick={goHome}
              className="py-2 px-3 rounded hover:bg-white/10 text-left"
            >
              Home
            </button>

            <button
              onClick={goDashboard}
              className="py-2 px-3 rounded hover:bg-white/10 text-left"
            >
              Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
