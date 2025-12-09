import React, {
  useState,
  useMemo,
  useCallback,
  lazy,
  Suspense,
  useEffect,
} from "react";
import { HiOutlinePlus, HiOutlineVideoCamera } from "react-icons/hi2";
import { useAuth } from "./contexts/AuthContext";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useCloudColumns } from "./hooks/useCloudColumns";
import { columnsAPI } from "./services/api";
import { generateId } from "./utils/localStorage";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import Column from "./components/Column";
import AuthPage from "./components/Auth/AuthPage";
import MigrationModal from "./components/MigrationModal";
import { KeyboardShortcutsIcon } from "./components/KeyboardShortcutsModal";

// Lazy load modals for better initial load performance
const EditItemModal = lazy(() => import("./components/EditItemModal"));
const AddSectionModal = lazy(() => import("./components/AddSectionModal"));
const ViewItemModal = lazy(() => import("./components/ViewItemModal"));
const KeyboardShortcutsModal = lazy(() =>
  import("./components/KeyboardShortcutsModal")
);

// Loading fallback for modals
const ModalLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
    <div className="text-gray-400 text-sm">Loading...</div>
  </div>
);

// Default columns configuration
const DEFAULT_COLUMNS = [
  { id: "col-ideas", title: "Ideas", color: "yellow", items: [] },
  { id: "col-scripting", title: "Scripting", color: "blue", items: [] },
  { id: "col-filming", title: "Filming", color: "red", items: [] },
  { id: "col-posted", title: "Posted", color: "green", items: [] },
];

export default function AuthenticatedApp() {
  const { user, loading: authLoading } = useAuth();

  // Always call both hooks to maintain consistent hook order
  const [localColumns, setLocalColumns] = useLocalStorage(
    "amrito_columns",
    DEFAULT_COLUMNS
  );
  const [cloudColumns, setCloudColumns, { loading: cloudLoading }] =
    useCloudColumns(DEFAULT_COLUMNS);

  // UI state - must ALL be declared before any conditional rendering
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [viewingColumnId, setViewingColumnId] = useState(null);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [showMigration, setShowMigration] = useState(false);
  const [migrationChecked, setMigrationChecked] = useState(false);

  // Determine which columns to use based on authentication
  const columns = user ? cloudColumns : localColumns;
  const setColumns = user ? setCloudColumns : setLocalColumns;

  // Filter items based on search query - memoized for performance
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

  // === MEMOIZED COLUMN OPERATIONS ===

  const addColumn = useCallback(
    (title, color) => {
      const newColumn = {
        id: `col-${generateId()}`,
        title,
        color,
        items: [],
      };
      setColumns((prev) => {
        const newColumns = [...prev];
        newColumns.splice(prev.length - 1, 0, newColumn);
        return newColumns;
      });
    },
    [setColumns]
  );

  const renameColumn = useCallback(
    (columnId, newTitle) => {
      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, title: newTitle } : col
        )
      );
    },
    [setColumns]
  );

  const deleteColumn = useCallback(
    (columnId) => {
      if (window.confirm("Delete this section and all its items?")) {
        setColumns((prev) => prev.filter((col) => col.id !== columnId));
      }
    },
    [setColumns]
  );

  // === MEMOIZED ITEM OPERATIONS ===

  const addItem = useCallback(
    (columnId, title) => {
      const newItem = {
        id: `item-${generateId()}`,
        title,
        description: "",
      };
      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, items: [...col.items, newItem] } : col
        )
      );
    },
    [setColumns]
  );

  const updateItem = useCallback(
    (updatedItem) => {
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          items: col.items.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          ),
        }))
      );
    },
    [setColumns]
  );

  const deleteItem = useCallback(
    (columnId, itemId) => {
      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? { ...col, items: col.items.filter((item) => item.id !== itemId) }
            : col
        )
      );
      // Close modals if deleting viewed/edited item
      setViewingItem((prev) => (prev?.id === itemId ? null : prev));
      setViewingColumnId((prev) => (viewingItem?.id === itemId ? null : prev));
      setEditingItem((prev) => (prev?.id === itemId ? null : prev));
    },
    [setColumns, viewingItem?.id]
  );

  const moveItem = useCallback(
    (fromColumnId, itemId, direction) => {
      setColumns((prev) => {
        const fromIndex = prev.findIndex((col) => col.id === fromColumnId);
        const toIndex = fromIndex + direction;

        if (toIndex < 0 || toIndex >= prev.length) return prev;

        const newColumns = prev.map((col) => ({
          ...col,
          items: [...col.items],
        }));
        const fromColumn = newColumns[fromIndex];
        const toColumn = newColumns[toIndex];

        const itemIndex = fromColumn.items.findIndex(
          (item) => item.id === itemId
        );
        if (itemIndex === -1) return prev;

        const [item] = fromColumn.items.splice(itemIndex, 1);
        toColumn.items.push(item);

        return newColumns;
      });

      // Update viewing column if item was being viewed
      if (viewingItem?.id === itemId) {
        setColumns((prev) => {
          const fromIndex = prev.findIndex((col) => col.id === fromColumnId);
          const toIndex = fromIndex + direction;
          if (toIndex >= 0 && toIndex < prev.length) {
            setViewingColumnId(prev[toIndex].id);
          }
          return prev;
        });
      }
    },
    [setColumns, viewingItem?.id]
  );

  // === MEMOIZED MODAL HANDLERS ===

  const handleEditItem = useCallback((item) => {
    setViewingItem(null);
    setViewingColumnId(null);
    setEditingItem(item);
  }, []);

  const handleViewItem = useCallback((item, columnId) => {
    setViewingItem(item);
    setViewingColumnId(columnId);
  }, []);

  const handleSaveItem = useCallback(
    (updatedItem) => {
      updateItem(updatedItem);
      setEditingItem(null);
    },
    [updateItem]
  );

  const handleCloseViewModal = useCallback(() => {
    setViewingItem(null);
    setViewingColumnId(null);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditingItem(null);
  }, []);

  const handleOpenAddSection = useCallback(() => {
    setIsAddSectionOpen(true);
  }, []);

  const handleCloseAddSection = useCallback(() => {
    setIsAddSectionOpen(false);
  }, []);

  // Find column for viewing item
  const viewingColumn = useMemo(
    () => columns.find((col) => col.id === viewingColumnId),
    [columns, viewingColumnId]
  );

  const viewingColumnIndex = useMemo(
    () => columns.findIndex((col) => col.id === viewingColumnId),
    [columns, viewingColumnId]
  );

  // Check if any modal is open for lazy loading
  const hasOpenModal =
    !!viewingItem || !!editingItem || isAddSectionOpen || isShortcutsOpen;

  // Check for migration on first login
  useEffect(() => {
    if (user && !authLoading && !cloudLoading && !migrationChecked) {
      setMigrationChecked(true);

      // Check if user has localStorage data and cloud is empty
      const hasLocalData =
        localColumns &&
        localColumns.length > 0 &&
        localColumns.some((col) => col.items.length > 0);

      const hasCloudData =
        cloudColumns &&
        cloudColumns.length > 0 &&
        cloudColumns.some((col) => col.items.length > 0);

      if (hasLocalData && !hasCloudData) {
        setShowMigration(true);
      }
    }
  }, [
    user,
    authLoading,
    cloudLoading,
    migrationChecked,
    localColumns,
    cloudColumns,
  ]);

  // Handle migration
  const handleMigrate = async (localData) => {
    await columnsAPI.migrateColumns(localData);
    // Refresh cloud columns
    const updatedColumns = await columnsAPI.getColumns();
    setCloudColumns(updatedColumns);
  };

  // === CONDITIONAL RENDERING (after all hooks) ===

  // Show auth page if not logged in
  if (!user && !authLoading) {
    return <AuthPage />;
  }

  // Show loading while authenticating or loading data
  if (authLoading || (user && cloudLoading)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading your workspace...</p>
        </div>
      </div>
    );
  }

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
              onClick={handleOpenAddSection}
              className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-400 border border-[#1a1a1a] rounded hover:text-green-400 hover:border-[#2a2a2a] transition-colors whitespace-nowrap"
            >
              <HiOutlinePlus className="w-3.5 h-3.5" />
              Add Section
            </button>
            {/* Keyboard Shortcuts Button */}
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="group relative p-2 text-gray-500 border border-[#1a1a1a] rounded hover:text-green-400 hover:border-[#2a2a2a] transition-colors"
              aria-label="Keyboard Shortcuts"
            >
              <KeyboardShortcutsIcon className="w-4 h-4" />
              {/* Tooltip */}
              <span className="absolute right-0 top-full mt-2 px-2 py-1 text-xs text-white bg-[#1a1a1a] border border-[#2a2a2a] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                Keyboard Shortcuts
              </span>
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

      {/* Migration Modal */}
      <MigrationModal
        isOpen={showMigration}
        onClose={() => setShowMigration(false)}
        onMigrate={handleMigrate}
        localData={localColumns}
      />

      {/* Lazy loaded modals with Suspense */}
      {hasOpenModal && (
        <Suspense fallback={<ModalLoader />}>
          <ViewItemModal
            isOpen={!!viewingItem}
            onClose={handleCloseViewModal}
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
            onClose={handleCloseEditModal}
            item={editingItem}
            onSave={handleSaveItem}
          />

          <AddSectionModal
            isOpen={isAddSectionOpen}
            onClose={handleCloseAddSection}
            onAdd={addColumn}
          />

          <KeyboardShortcutsModal
            isOpen={isShortcutsOpen}
            onClose={() => setIsShortcutsOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
