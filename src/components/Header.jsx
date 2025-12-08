import React, { memo } from "react";
import { HiOutlineCommandLine, HiOutlineSignal } from "react-icons/hi2";

// Memoize the date calculation to avoid recalculating on every render
const formatDate = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

/**
 * Header component - Terminal-style app header
 * Memoized since it doesn't depend on props and rarely changes
 */
const Header = memo(function Header() {
  const currentDate = formatDate();

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

      {/* Status */}
      <div className="flex items-center gap-4 text-xs">
        <div className="hidden sm:flex items-center gap-2 text-gray-500">
          <HiOutlineSignal className="w-4 h-4 text-green-500" />
          <span>Online</span>
        </div>
        <div className="text-gray-600">{currentDate}</div>
      </div>
    </header>
  );
});

export default Header;
