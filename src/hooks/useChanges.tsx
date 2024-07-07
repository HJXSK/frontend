import {useMemo, useState} from 'react';

/**
 * A custom hook that calculates the changes between the original state and the new state
 * @param originalState The original state
 * @returns The new state, a function to update the new state, the changes, and whether any changes have been made
 */
export default function useChanges(originalState: any) {
  const [newState, setNewState] = useState(originalState);
  const [changes, isEdited] = useMemo(() => {
    // Calculate the changes between the original state and the new state
    const result = Object.keys(newState).reduce((acc, key) => {
      if (newState[key] !== originalState[key]) {
        acc[key] = newState[key];
      }
      return acc;
    }, {} as {[key: string]: any});

    // Check if any changes were made
    const isEdited = Object.keys(result).length > 0;

    return [result, isEdited];
  }, [newState, originalState]);

  return [newState, setNewState, changes, isEdited];
}
