import { useState, useEffect } from "react";
import { getItem, setItem } from "../utils/localStorage";

/**
 * Custom hook for state that persists to localStorage
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial/default value
 * @returns {[any, function]} State value and setter
 */
export function useLocalStorage(key, initialValue) {
  // Initialize state from localStorage or use initial value
  const [value, setValue] = useState(() => {
    const stored = getItem(key);
    return stored !== null ? stored : initialValue;
  });

  // Sync to localStorage whenever value changes
  useEffect(() => {
    setItem(key, value);
  }, [key, value]);

  return [value, setValue];
}
