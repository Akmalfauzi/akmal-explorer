/**
 * Performance Optimization Utilities
 * 
 * This file contains utilities for optimizing application performance:
 * - Memoization for expensive computations
 * - Debounce for rate-limiting function calls
 * - Throttle for controlling function execution frequency
 */

/**
 * Memoize a function to cache results based on arguments
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    
    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }

    return result;
  }) as T;
}

/**
 * Debounce a function to delay execution until after wait milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
    }, wait);
  };
}

/**
 * Throttle a function to execute at most once per interval
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  interval: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall >= interval) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * Create a lazy loader function that loads data in chunks
 */
export function createLazyLoader<T>(
  items: T[],
  chunkSize: number = 20
): {
  loadMore: () => T[];
  hasMore: boolean;
  reset: () => void;
  currentItems: T[];
} {
  let currentIndex = 0;
  let currentItems: T[] = [];

  return {
    loadMore: () => {
      const newItems = items.slice(currentIndex, currentIndex + chunkSize);
      currentItems = [...currentItems, ...newItems];
      currentIndex += chunkSize;
      return newItems;
    },
    get hasMore() {
      return currentIndex < items.length;
    },
    reset: () => {
      currentIndex = 0;
      currentItems = [];
    },
    get currentItems() {
      return currentItems;
    }
  };
}

/**
 * Simple LRU Cache implementation
 */
export class LRUCache<K, V> {
  private cache: Map<K, V>;
  private maxSize: number;

  constructor(maxSize: number = 50) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    // Move to end (most recently used)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  set(key: K, value: V): void {
    // Remove if exists to reinsert at end
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    this.cache.set(key, value);

    // Remove oldest if exceeded max size
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}
