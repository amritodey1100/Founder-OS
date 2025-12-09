import { useState, useEffect } from "react";
import { columnsAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

/**
 * Custom hook to manage columns with cloud sync
 * Replaces useLocalStorage when user is authenticated
 */
export function useCloudColumns(defaultColumns) {
  const { user } = useAuth();
  const [columns, setColumns] = useState(defaultColumns);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch columns from backend on mount
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchColumns = async () => {
      try {
        const cloudColumns = await columnsAPI.getColumns();
        setColumns(cloudColumns);
      } catch (err) {
        console.error("Error fetching columns:", err);
        setError(err.message);
        // Fallback to default columns on error
        setColumns(defaultColumns);
      } finally {
        setLoading(false);
      }
    };

    fetchColumns();
  }, [user]);

  // Sync with retry logic (exponential backoff)
  const syncWithRetry = async (data, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        await columnsAPI.updateColumns(data);
        return; // Success
      } catch (err) {
        if (i === retries - 1) {
          // Last retry failed
          throw err;
        }
        // Wait before retrying (exponential backoff: 1s, 2s, 4s)
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, i))
        );
      }
    }
  };

  // Custom setter that syncs to cloud
  const setColumnsWithSync = async (newColumns) => {
    // Support function updater
    const columnsToSet =
      typeof newColumns === "function" ? newColumns(columns) : newColumns;

    // Optimistic update (update UI immediately)
    setColumns(columnsToSet);

    // Sync to backend with retry
    if (user) {
      try {
        await syncWithRetry(columnsToSet);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error syncing columns:", err);
        setError(err.message);
        // Could implement a queue here to retry later
      }
    }
  };

  return [columns, setColumnsWithSync, { loading, error }];
}
