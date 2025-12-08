import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Modal from "./Modal";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from "react-icons/hi2";

/**
 * ViewItemModal - Modal for viewing item details with rendered markdown
 */
export default function ViewItemModal({
  isOpen,
  onClose,
  item,
  columnTitle,
  onEdit,
  onDelete,
  onMoveLeft,
  onMoveRight,
  canMoveLeft,
  canMoveRight,
}) {
  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={columnTitle || "Item"}
      size="lg"
    >
      <div className="space-y-4">
        {/* Title and actions */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-white">{item.title}</h3>
          <div className="flex items-center gap-1 shrink-0">
            {canMoveLeft && (
              <button
                onClick={() => onMoveLeft(item.id)}
                className="p-1.5 text-gray-500 hover:text-white hover:bg-[#1a1a1a] rounded transition-colors"
                title="Move left"
              >
                <HiOutlineChevronLeft className="w-4 h-4" />
              </button>
            )}
            {canMoveRight && (
              <button
                onClick={() => onMoveRight(item.id)}
                className="p-1.5 text-gray-500 hover:text-white hover:bg-[#1a1a1a] rounded transition-colors"
                title="Move right"
              >
                <HiOutlineChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onEdit(item)}
              className="p-1.5 text-gray-500 hover:text-cyan-400 hover:bg-[#1a1a1a] rounded transition-colors"
              title="Edit"
            >
              <HiOutlinePencilSquare className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-[#1a1a1a] rounded transition-colors"
              title="Delete"
            >
              <HiOutlineTrash className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="border-t border-[#1a1a1a] pt-4">
          {item.description ? (
            <div className="prose-terminal text-sm max-h-[400px] overflow-y-auto custom-scrollbar">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {item.description}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-gray-600 text-sm italic">
              No description. Click edit to add one.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
