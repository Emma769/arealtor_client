import { useState } from "react";

export default function useLocalStorage<T>(key: string, fallback: T) {
  const [payload, setPayload] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  });

  return [
    payload,
    (data: T) => {
      localStorage.setItem(key, JSON.stringify(data));
      setPayload(data);
    },
  ] as const;
}
