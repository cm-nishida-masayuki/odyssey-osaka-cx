import { useCallback, useSyncExternalStore } from "react";

const parseJSONOrNull = <T>(item: string): T | null => {
  try {
    return JSON.parse(item);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("JSON文字列からパースできませんでした", item);
    return null;
  }
};

const subscribeToLocalStorage = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
  };
};

/**
 * ローカルストレージを扱う際に利用できるhooks
 * setterが叩かれると値も更新される
 */
export const useLocalStore = <T = unknown>(
  itemName: string
): [T | null, (value: T) => void] => {
  const changeValue = useCallback(
    (value: T) => {
      window.localStorage.setItem(itemName, JSON.stringify(value));
      window.dispatchEvent(new Event("storage"));
    },
    [itemName]
  );

  const rawValue = useSyncExternalStore(
    subscribeToLocalStorage,
    () => window.localStorage.getItem(itemName),
    () => null
  );
  const value = rawValue !== null ? parseJSONOrNull<T>(rawValue) : null;

  return [value, changeValue];
};
