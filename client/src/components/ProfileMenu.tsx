import type { DecodedUser } from "../utils/auth";
import * as React from "react";

interface Props {
    user: DecodedUser | null;
    onLogout: () => void;
    onDashboard: () => void;
  }
  
  const ProfileMenu: React.FC<Props> = ({ user, onLogout, onDashboard }) => {
    return (
        <div className="absolute right-0 mt-3 w-60 rounded-xl  backdrop-blur-md bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700 text-gray-100 z-50">
      {/* Header section */}
      <div className="border-b border-slate-700 px-4 py-3">
        <p className="font-semibold text-white text-sm">
          {user?.username}
        </p>
        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
      </div>

      
      <div className="flex flex-col px-4 py-4 gap-2">
        <button
          onClick={onDashboard}
          className="text-left text-sm py-2 px-3 rounded-md hover:bg-slate-700/70 transition"
        >
          My Dashboard
        </button>

        <button
          onClick={onLogout}
          className="text-left text-sm py-2 px-3 rounded-md hover:bg-red-600/70 hover:text-white transition text-red-400"
        >
          Logout
        </button>
      </div>
    </div>
    );
  };
  
  export default ProfileMenu;
  