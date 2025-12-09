import React, { memo } from "react";
import {
  HiOutlineCommandLine,
  HiOutlineSignal,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { useAuth } from "../contexts/AuthContext";

// Memoize the date calculation to avoid recalculating on every render
const formatDate = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

/**
 * Header component - Terminal-style app header
 */
const Header = memo(function Header() {
  const currentDate = formatDate();
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-[#1a1a1a] pb-4 mb-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded">
          <HiOutlineCommandLine className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            AMRITO<span className="text-green-500">_OS</span>
          </h1>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">
            Content Pipeline v1.0
          </p>
        </div>
      </div>

      {/* Status & User */}
      <div className="flex items-center gap-4 text-xs">
        <div className="hidden sm:flex items-center gap-2 text-gray-500">
          <HiOutlineSignal className="w-4 h-4 text-green-500" />
          <span>Online</span>
        </div>
        <div className="text-gray-600">{currentDate}</div>

        {/* User info and logout */}
        {user && (
          <>
            <div className="hidden md:block text-gray-500">{user.email}</div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-2 py-1 text-gray-400 hover:text-red-400 border border-[#1a1a1a] hover:border-red-500/30 rounded transition-colors"
              title="Logout"
            >
              <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
});

export default Header;
