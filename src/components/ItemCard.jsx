import React from "react";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from "react-icons/hi2";

/**
 * ItemCard component - Individual task/item in a column
 */
export default function ItemCard({
  item,
  onEdit,
  onDelete,
  onMoveLeft,
  onMoveRight,
  canMoveLeft,
  canMoveRight,
}) {
  // Truncate description for preview
  const descriptionPreview = item.description
    ? item.description.slice(0, 80) +
      (item.description.length > 80 ? "..." : "")
    : null;

  return (
    <div className="group bg-black border border-[#1a1a1a] rounded p-3 hover:border-[#2a2a2a] transition-all duration-150 cursor-pointer animate-slideUp">
      {/* Title */}
      <div className="flex items-start justify-between gap-2">
        <h4
          className="text-sm text-gray-200 font-medium leading-snug flex-1"
          onClick={() => onEdit(item)}
        >
          {item.title}
        </h4>

        {/* Actions - visible on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {canMoveLeft && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveLeft(item.id);
              }}
              className="p-1 text-gray-600 hover:text-white transition-colors"
              title="Move left"
            >
              <HiOutlineChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
          {canMoveRight && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveRight(item.id);
              }}
              className="p-1 text-gray-600 hover:text-white transition-colors"
              title="Move right"
            >
              <HiOutlineChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="p-1 text-gray-600 hover:text-cyan-400 transition-colors"
            title="Edit"
          >
            <HiOutlinePencilSquare className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="p-1 text-gray-600 hover:text-red-400 transition-colors"
            title="Delete"
          >
            <HiOutlineTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Description preview */}
      {descriptionPreview && (
        <p
          className="text-xs text-gray-500 mt-2 leading-relaxed"
          onClick={() => onEdit(item)}
        >
          {descriptionPreview}
        </p>
      )}
    </div>
  );
}
