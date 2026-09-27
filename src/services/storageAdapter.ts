/**
 * Isolated Storage Adapter
 * Abstracts localStorage operations and error handling.
 * Provides a clean boundary for future backend API migration.
 */

class StorageAdapter {
  private memoryFallback: Map<string, string> = new Map();

  private isLocalStorageAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = '__pv_storage_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  getItem<T>(key: string, defaultValue: T): T {
    try {
      if (this.isLocalStorageAvailable()) {
        const raw = window.localStorage.getItem(key);
        if (raw === null || raw === undefined) {
          return defaultValue;
        }
        return JSON.parse(raw) as T;
      } else {
        const mem = this.memoryFallback.get(key);
        if (!mem) return defaultValue;
        return JSON.parse(mem) as T;
      }
    } catch (err) {
      console.warn(`[StorageAdapter] Failed to read key "${key}":`, err);
      return defaultValue;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      if (this.isLocalStorageAvailable()) {
        window.localStorage.setItem(key, serialized);
      } else {
        this.memoryFallback.set(key, serialized);
      }
    } catch (err) {
      console.error(`[StorageAdapter] Failed to write key "${key}":`, err);
    }
  }

  removeItem(key: string): void {
    try {
      if (this.isLocalStorageAvailable()) {
        window.localStorage.removeItem(key);
      } else {
        this.memoryFallback.delete(key);
      }
    } catch (err) {
      console.warn(`[StorageAdapter] Failed to remove key "${key}":`, err);
    }
  }

  clearAll(): void {
    try {
      if (this.isLocalStorageAvailable()) {
        window.localStorage.clear();
      }
      this.memoryFallback.clear();
    } catch (err) {
      console.warn('[StorageAdapter] Failed to clear storage:', err);
    }
  }
}

export const storageAdapter = new StorageAdapter();
