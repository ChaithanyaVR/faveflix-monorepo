import * as React from "react";
import type { DecodedUser } from "../utils/auth";
import { LayoutDashboard, LogOut } from "lucide-react";

interface Props {
  user: DecodedUser | null;
  onLogout: () => void;
  onDashboard: () => void | Promise<void>;
}

const ProfileMenu: React.FC<Props> = ({ user, onLogout, onDashboard }) => {
  return (
    <div className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg py-2 z-50">

      <div className="px-4 py-3 border-b border-neutral-700">
        <p className="text-sm font-semibold text-white">{user?.username}</p>
        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
      </div>

      <div className="px-2 py-2 flex flex-col gap-1">

        <button
          onClick={onDashboard}
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10 text-sm text-gray-200"
        >
          <LayoutDashboard size={16}/> Dashboard
        </button>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 rounded hover:bg-red-600/50 text-sm text-red-400"
        >
          <LogOut size={16}/> Logout
        </button>

      </div>
    </div>
  );
};

export default ProfileMenu;
