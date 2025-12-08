import React from "react";
import { HiOutlineMagnifyingGlass, HiXMark } from "react-icons/hi2";

/**
 * SearchBar component - Global search/filter for items
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = "Search items...",
}) {
  return (
    <div className="relative">
      <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-md pl-9 pr-8 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-[#2a2a2a] transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-gray-400 transition-colors"
        >
          <HiXMark className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
