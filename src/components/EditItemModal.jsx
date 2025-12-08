import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import MarkdownEditor from "./MarkdownEditor";

/**
 * EditItemModal - Modal for editing item title and markdown description
 */
export default function EditItemModal({ isOpen, onClose, item, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Sync state when item changes using key pattern
  // This is acceptable since we're syncing external props to local state
  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setDescription(item.description || "");
    }
  }, [item?.id]); // Only sync when item.id changes, not on every render

  const handleSave = () => {
    if (title.trim()) {
      onSave({
        ...item,
        title: title.trim(),
        description: description,
      });
      onClose();
    }
  };

  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Item" size="lg">
      <div className="space-y-4">
        {/* Title input */}
        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Item title..."
            className="w-full bg-black border border-[#1a1a1a] rounded px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-[#2a2a2a]"
          />
        </div>

        {/* Description with MarkdownEditor */}
        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
            Description
          </label>
          <MarkdownEditor
            value={description}
            onChange={setDescription}
            placeholder="Write your description using Markdown..."
            minHeight="256px"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-[#1a1a1a]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-4 py-2 text-xs bg-green-600 text-black font-medium rounded hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}
