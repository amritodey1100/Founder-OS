import React, { useState } from "react";
import Modal from "./Modal";

// Available colors for new columns
const COLOR_OPTIONS = [
  { value: "yellow", label: "Yellow", class: "bg-yellow-500" },
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "red", label: "Red", class: "bg-red-500" },
  { value: "green", label: "Green", class: "bg-green-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "pink", label: "Pink", class: "bg-pink-500" },
  { value: "cyan", label: "Cyan", class: "bg-cyan-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
];

/**
 * AddSectionModal - Modal for creating new columns/sections
 */
export default function AddSectionModal({ isOpen, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("cyan");

  const handleAdd = () => {
    if (title.trim()) {
      onAdd(title.trim(), color);
      setTitle("");
      setColor("cyan");
      onClose();
    }
  };

  const handleClose = () => {
    setTitle("");
    setColor("cyan");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Section"
      size="sm"
    >
      <div className="space-y-4">
        {/* Title input */}
        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
            Section Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="e.g., Editing, Review, Archive..."
            autoFocus
            className="w-full bg-black border border-[#1a1a1a] rounded px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-[#2a2a2a]"
          />
        </div>

        {/* Color picker */}
        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">
            Indicator Color
          </label>
          <div className="flex flex-wrap gap-2">
            {COLOR_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setColor(opt.value)}
                className={`w-7 h-7 rounded-full ${opt.class} transition-all ${
                  color === opt.value
                    ? "ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0a]"
                    : "opacity-60 hover:opacity-100"
                }`}
                title={opt.label}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-[#1a1a1a]">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-xs text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!title.trim()}
            className="px-4 py-2 text-xs bg-green-600 text-black font-medium rounded hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create Section
          </button>
        </div>
      </div>
    </Modal>
  );
}
