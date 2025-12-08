import React, { memo, useState, useCallback } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCheck,
  HiXMark,
} from "react-icons/hi2";
import ItemCard from "./ItemCard";

// Color options for column indicators
const COLUMN_COLORS = {
  yellow: "bg-yellow-500",
  blue: "bg-blue-500",
  red: "bg-red-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  cyan: "bg-cyan-500",
  orange: "bg-orange-500",
};

/**
 * Column component - Kanban column with items
 * Memoized to prevent re-renders when other columns change
 */
const Column = memo(function Column({
  column,
  items,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onMoveItem,
  onRenameColumn,
  onDeleteColumn,
  canMoveLeft,
  canMoveRight,
  isFirst,
  isLast,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");

  // Memoized handlers to prevent child re-renders
  const handleRename = useCallback(() => {
    if (editTitle.trim() && editTitle !== column.title) {
      onRenameColumn(column.id, editTitle.trim());
    }
    setIsEditing(false);
  }, [editTitle, column.title, column.id, onRenameColumn]);

  const handleAddItem = useCallback(() => {
    if (newItemTitle.trim()) {
      onAddItem(column.id, newItemTitle.trim());
      setNewItemTitle("");
      setIsAddingItem(false);
    }
  }, [newItemTitle, column.id, onAddItem]);

  const handleDeleteItem = useCallback(
    (itemId) => {
      onDeleteItem(column.id, itemId);
    },
    [column.id, onDeleteItem]
  );

  const handleMoveLeft = useCallback(
    (itemId) => {
      onMoveItem(column.id, itemId, -1);
    },
    [column.id, onMoveItem]
  );

  const handleMoveRight = useCallback(
    (itemId) => {
      onMoveItem(column.id, itemId, 1);
    },
    [column.id, onMoveItem]
  );

  const colorClass = COLUMN_COLORS[column.color] || COLUMN_COLORS.green;

  return (
    <div className="bg-[#0a0a0a]/50 border border-[#1a1a1a] rounded-lg flex flex-col h-[400px] md:h-[500px]">
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Color dot */}
          <span className={`w-2 h-2 rounded-full ${colorClass} shrink-0`} />

          {/* Title - editable */}
          {isEditing ? (
            <div className="flex items-center gap-1 flex-1">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRename()}
                autoFocus
                className="flex-1 bg-black border border-[#2a2a2a] rounded px-2 py-0.5 text-xs text-white outline-none"
              />
              <button
                onClick={handleRename}
                className="p-1 text-green-500 hover:text-green-400"
              >
                <HiOutlineCheck className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(column.title);
                }}
                className="p-1 text-gray-500 hover:text-gray-300"
              >
                <HiXMark className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <h3
              className="text-xs font-semibold text-gray-400 uppercase tracking-wider truncate cursor-pointer hover:text-gray-200"
              onDoubleClick={() => setIsEditing(true)}
              title="Double-click to rename"
            >
              {column.title}
            </h3>
          )}
        </div>

        {/* Column actions */}
        <div className="flex items-center gap-1 ml-2">
          <span className="text-[10px] bg-[#1a1a1a] px-2 py-0.5 rounded-full text-gray-500 mr-1">
            {items.length}
          </span>
          {!isFirst && !isLast && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-600 hover:text-gray-300 transition-colors"
                title="Rename"
              >
                <HiOutlinePencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeleteColumn(column.id)}
                className="p-1 text-gray-600 hover:text-red-400 transition-colors"
                title="Delete column"
              >
                <HiOutlineTrash className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {items.length === 0 && !isAddingItem && (
          <p className="text-gray-700 text-xs text-center py-8 italic">
            No items yet...
          </p>
        )}
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onEdit={onEditItem}
            onDelete={handleDeleteItem}
            onMoveLeft={handleMoveLeft}
            onMoveRight={handleMoveRight}
            canMoveLeft={canMoveLeft}
            canMoveRight={canMoveRight}
          />
        ))}

        {/* Inline add item */}
        {isAddingItem && (
          <div className="bg-black border border-[#2a2a2a] rounded p-2 animate-slideUp">
            <input
              type="text"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
              placeholder="Enter item title..."
              autoFocus
              className="w-full bg-transparent text-sm text-white placeholder-gray-600 outline-none"
            />
            <div className="flex justify-end gap-1 mt-2">
              <button
                onClick={() => {
                  setIsAddingItem(false);
                  setNewItemTitle("");
                }}
                className="px-2 py-1 text-xs text-gray-500 hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                disabled={!newItemTitle.trim()}
                className="px-2 py-1 text-xs bg-green-600 text-black rounded hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add item button */}
      {!isAddingItem && (
        <button
          onClick={() => setIsAddingItem(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 border-t border-[#1a1a1a] text-xs text-gray-500 hover:text-green-400 hover:bg-[#0a0a0a] transition-colors"
        >
          <HiOutlinePlus className="w-3.5 h-3.5" />
          Add Item
        </button>
      )}
    </div>
  );
});

export default Column;
