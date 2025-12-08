import React, { useState, useMemo } from "react";
import { HiOutlinePlus, HiOutlineVideoCamera } from "react-icons/hi2";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { generateId } from "./utils/localStorage";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import Column from "./components/Column";
import EditItemModal from "./components/EditItemModal";
import AddSectionModal from "./components/AddSectionModal";
import ViewItemModal from "./components/ViewItemModal";

// Default columns configuration
const DEFAULT_COLUMNS = [
  { id: "col-ideas", title: "Ideas", color: "yellow", items: [] },
  { id: "col-scripting", title: "Scripting", color: "blue", items: [] },
  { id: "col-filming", title: "Filming", color: "red", items: [] },
  { id: "col-posted", title: "Posted", color: "green", items: [] },
];

export default function App() {
  // Persistent state
  const [columns, setColumns] = useLocalStorage(
    "amrito_columns",
    DEFAULT_COLUMNS
  );

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [viewingColumnId, setViewingColumnId] = useState(null);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);

  // Filter items based on search query
  const filteredColumns = useMemo(() => {
    if (!searchQuery.trim()) return columns;

    const query = searchQuery.toLowerCase();
    return columns.map((col) => ({
      ...col,
      items: col.items.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
      ),
    }));
  }, [columns, searchQuery]);

  // === COLUMN OPERATIONS ===

  const addColumn = (title, color) => {
    const newColumn = {
      id: `col-${generateId()}`,
      title,
      color,
      items: [],
    };
    // Insert before the last column (Posted)
    const newColumns = [...columns];
    newColumns.splice(columns.length - 1, 0, newColumn);
    setColumns(newColumns);
  };

  const renameColumn = (columnId, newTitle) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId ? { ...col, title: newTitle } : col
      )
    );
  };

  const deleteColumn = (columnId) => {
    if (window.confirm("Delete this section and all its items?")) {
      setColumns(columns.filter((col) => col.id !== columnId));
    }
  };

  // === ITEM OPERATIONS ===

  const addItem = (columnId, title) => {
    const newItem = {
      id: `item-${generateId()}`,
      title,
      description: "",
    };
    setColumns(
      columns.map((col) =>
        col.id === columnId ? { ...col, items: [...col.items, newItem] } : col
      )
    );
  };

  const updateItem = (updatedItem) => {
    setColumns(
      columns.map((col) => ({
        ...col,
        items: col.items.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        ),
      }))
    );
  };

  const deleteItem = (columnId, itemId) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId
          ? { ...col, items: col.items.filter((item) => item.id !== itemId) }
          : col
      )
    );
    // Close modals if deleting viewed/edited item
    if (viewingItem?.id === itemId) {
      setViewingItem(null);
      setViewingColumnId(null);
    }
    if (editingItem?.id === itemId) {
      setEditingItem(null);
    }
  };

  const moveItem = (fromColumnId, itemId, direction) => {
    const fromIndex = columns.findIndex((col) => col.id === fromColumnId);
    const toIndex = fromIndex + direction;

    if (toIndex < 0 || toIndex >= columns.length) return;

    const newColumns = columns.map((col) => ({
      ...col,
      items: [...col.items],
    }));
    const fromColumn = newColumns[fromIndex];
    const toColumn = newColumns[toIndex];

    // Find and remove item from source column
    const itemIndex = fromColumn.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) return;

    const [item] = fromColumn.items.splice(itemIndex, 1);
    toColumn.items.push(item);

    setColumns(newColumns);

    // Update viewing column if item was being viewed
    if (viewingItem?.id === itemId) {
      setViewingColumnId(toColumn.id);
    }
  };

  // === MODAL HANDLERS ===

  const handleEditItem = (item) => {
    setViewingItem(null);
    setViewingColumnId(null);
    setEditingItem(item);
  };

  const handleViewItem = (item, columnId) => {
    setViewingItem(item);
    setViewingColumnId(columnId);
  };

  const handleSaveItem = (updatedItem) => {
    updateItem(updatedItem);
    setEditingItem(null);
  };

  // Find column for viewing item
  const viewingColumn = columns.find((col) => col.id === viewingColumnId);
  const viewingColumnIndex = columns.findIndex(
    (col) => col.id === viewingColumnId
  );

  return (
    <div className="min-h-screen bg-black text-gray-200 p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <Header />

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <HiOutlineVideoCamera className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-semibold text-white uppercase tracking-wide">
              Content Pipeline
            </h2>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:w-64">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search ideas, scripts..."
              />
            </div>
            <button
              onClick={() => setIsAddSectionOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-400 border border-[#1a1a1a] rounded hover:text-green-400 hover:border-[#2a2a2a] transition-colors whitespace-nowrap"
            >
              <HiOutlinePlus className="w-3.5 h-3.5" />
              Add Section
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredColumns.map((column, index) => (
            <Column
              key={column.id}
              column={column}
              items={column.items}
              onAddItem={addItem}
              onEditItem={(item) => handleViewItem(item, column.id)}
              onDeleteItem={deleteItem}
              onMoveItem={moveItem}
              onRenameColumn={renameColumn}
              onDeleteColumn={deleteColumn}
              canMoveLeft={index > 0}
              canMoveRight={index < columns.length - 1}
              isFirst={index === 0}
              isLast={index === columns.length - 1}
            />
          ))}
        </div>

        {/* Empty state when searching */}
        {searchQuery &&
          filteredColumns.every((col) => col.items.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-sm">
                No items found matching "
                <span className="text-gray-400">{searchQuery}</span>"
              </p>
            </div>
          )}
      </div>

      {/* Modals */}
      <ViewItemModal
        isOpen={!!viewingItem}
        onClose={() => {
          setViewingItem(null);
          setViewingColumnId(null);
        }}
        item={viewingItem}
        columnTitle={viewingColumn?.title}
        onEdit={handleEditItem}
        onDelete={(itemId) => deleteItem(viewingColumnId, itemId)}
        onMoveLeft={(itemId) => moveItem(viewingColumnId, itemId, -1)}
        onMoveRight={(itemId) => moveItem(viewingColumnId, itemId, 1)}
        canMoveLeft={viewingColumnIndex > 0}
        canMoveRight={viewingColumnIndex < columns.length - 1}
      />

      <EditItemModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        item={editingItem}
        onSave={handleSaveItem}
      />

      <AddSectionModal
        isOpen={isAddSectionOpen}
        onClose={() => setIsAddSectionOpen(false)}
        onAdd={addColumn}
      />
    </div>
  );
}
