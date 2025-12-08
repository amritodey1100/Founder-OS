import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Modal from "./Modal";
import {
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineDocumentText,
} from "react-icons/hi2";

/**
 * EditItemModal - Modal for editing item title and markdown description
 */
export default function EditItemModal({ isOpen, onClose, item, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState("edit"); // 'edit' | 'preview'

  // Sync state when item changes
  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setDescription(item.description || "");
      setActiveTab("edit");
    }
  }, [item]);

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

        {/* Description with tabs */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-gray-500 uppercase tracking-wide">
              Description
            </label>
            <div className="flex items-center gap-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded p-0.5">
              <button
                onClick={() => setActiveTab("edit")}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                  activeTab === "edit"
                    ? "bg-[#1a1a1a] text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <HiOutlinePencilSquare className="w-3 h-3" />
                Edit
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                  activeTab === "preview"
                    ? "bg-[#1a1a1a] text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <HiOutlineEye className="w-3 h-3" />
                Preview
              </button>
            </div>
          </div>

          {activeTab === "edit" ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your description using Markdown...

# Heading
**Bold**, *italic*, ~~strikethrough~~

- Bullet list
1. Numbered list
- [ ] Checkbox

> Blockquote

`inline code`

```
code block
```"
              className="w-full h-64 bg-black border border-[#1a1a1a] rounded px-3 py-2 text-sm text-gray-200 placeholder-gray-700 outline-none focus:border-[#2a2a2a] resize-none custom-scrollbar"
            />
          ) : (
            <div className="h-64 bg-black border border-[#1a1a1a] rounded px-4 py-3 overflow-y-auto custom-scrollbar">
              {description ? (
                <div className="prose-terminal text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {description}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-gray-600 text-sm italic flex items-center gap-2">
                  <HiOutlineDocumentText className="w-4 h-4" />
                  No description yet...
                </p>
              )}
            </div>
          )}

          <p className="text-[10px] text-gray-600 mt-1.5">
            Supports Markdown: headings, bold, italic, lists, checkboxes, code
            blocks, tables, and more.
          </p>
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
