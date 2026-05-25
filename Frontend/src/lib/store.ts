import { useEffect, useState, useCallback } from "react";

const PREFIX = "yp_store_";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = sessionStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("yp-store-change", { detail: key }));
}

export function useStore<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    setValue(read(key, initial));
    const h = (e: Event) => {
      const ev = e as CustomEvent<string>;
      if (!ev.detail || ev.detail === key) setValue(read(key, initial));
    };
    window.addEventListener("yp-store-change", h as EventListener);
    return () => window.removeEventListener("yp-store-change", h as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback((updater: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const next = typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater;
      write(key, next);
      return next;
    });
  }, [key]);

  return [value, update] as const;
}

export const uid = () => Math.random().toString(36).slice(2, 10);
