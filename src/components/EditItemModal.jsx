import React, { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import MarkdownEditor from "./MarkdownEditor";

/**
 * EditItemModal - Modal for editing item title and markdown description
 * Auto-saves description changes after 1 second of inactivity
 */
export default function EditItemModal({ isOpen, onClose, item, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef(null);

  // Sync state when item changes using key pattern
  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setDescription(item.description || "");
    }
  }, [item?.id]);

  // Auto-save description changes after 1 second of inactivity
  useEffect(() => {
    if (!item) return;

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Don't auto-save if nothing has changed
    if (description === (item.description || "")) {
      return;
    }

    // Set saving indicator
    setIsSaving(true);

    // Save after 1 second of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      if (title.trim()) {
        onSave({
          ...item,
          title: title.trim(),
          description: description,
        });
        setIsSaving(false);
      }
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [description, title, item, onSave]);

  const handleSave = () => {
    if (title.trim()) {
      // Clear any pending auto-save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

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
        {/* Auto-save indicator */}
        {isSaving && (
          <div className="flex items-center gap-2 text-xs text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Saving...
          </div>
        )}

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
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-4 py-2 text-xs bg-green-600 text-black font-medium rounded hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save & Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
