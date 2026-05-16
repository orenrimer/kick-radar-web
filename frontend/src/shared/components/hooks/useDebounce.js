import { useEffect, useState } from 'react';

// Returns `value` after it stops changing for `delayMs`. Useful for search
// inputs so the filter only runs when the user pauses typing.
export function useDebounce(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
