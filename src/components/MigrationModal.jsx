import React, { useState } from "react";
import Modal from "./Modal";
import { HiCloudArrowUp, HiOutlineCheckCircle } from "react-icons/hi2";

export default function MigrationModal({
  isOpen,
  onClose,
  onMigrate,
  localData,
}) {
  const [migrating, setMigrating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Calculate stats
  const totalColumns = localData?.length || 0;
  const totalItems =
    localData?.reduce((sum, col) => sum + col.items.length, 0) || 0;

  const handleMigrate = async () => {
    setMigrating(true);
    setError(null);

    try {
      await onMigrate(localData);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || "Migration failed");
    } finally {
      setMigrating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={success ? onClose : undefined}>
      <div className="p-6">
        {success ? (
          // Success State
          <div className="text-center">
            <HiOutlineCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Migration Successful!
            </h3>
            <p className="text-gray-400 text-sm">
              Your data has been safely migrated to the cloud.
            </p>
          </div>
        ) : (
          // Migration Prompt
          <>
            <div className="flex items-center gap-3 mb-4">
              <HiCloudArrowUp className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-bold text-white">Migrate to Cloud</h3>
            </div>

            <p className="text-gray-400 text-sm mb-4">
              We detected existing data in your browser. Migrate it to the cloud
              to access across all your devices.
            </p>

            {/* Data Preview */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded p-4 mb-6">
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">
                Found in localStorage
              </p>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-2xl font-bold text-white">
                    {totalColumns}
                  </span>
                  <p className="text-gray-500">Columns</p>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">
                    {totalItems}
                  </span>
                  <p className="text-gray-500">Items</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={migrating}
                className="flex-1 px-4 py-2 text-sm text-gray-400 border border-[#1a1a1a] rounded hover:text-white hover:border-[#2a2a2a] transition-colors disabled:opacity-50"
              >
                Skip for Now
              </button>
              <button
                onClick={handleMigrate}
                disabled={migrating}
                className="flex-1 px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {migrating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Migrating...
                  </>
                ) : (
                  <>
                    <HiCloudArrowUp className="w-4 h-4" />
                    Migrate to Cloud
                  </>
                )}
              </button>
            </div>

            <p className="text-gray-600 text-xs mt-4 text-center">
              Your local data will remain as a backup
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}
