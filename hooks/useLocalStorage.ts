import { useState, useEffect, Dispatch, SetStateAction } from 'react';

// FIX: Update function signature to use imported Dispatch and SetStateAction types.
function useLocalStorage<T,>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const valueToStore = JSON.stringify(storedValue);
      window.localStorage.setItem(key, valueToStore);
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
