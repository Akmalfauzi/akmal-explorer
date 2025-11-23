/**
 * Cache Service Interface
 * Abstraction for cache providers (Redis, Memcached, In-Memory, etc.)
 */
export interface ICache {
  /**
   * Get value from cache
   * @param key Cache key
   * @returns Cached value or null if not found
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Set value in cache
   * @param key Cache key
   * @param value Value to cache
   * @param ttl Time to live in seconds (optional)
   */
  set<T>(key: string, value: T, ttl?: number): Promise<void>;

  /**
   * Delete value from cache
   * @param key Cache key
   */
  del(key: string): Promise<void>;

  /**
   * Delete multiple keys matching pattern
   * @param pattern Key pattern (e.g., "user:*")
   */
  delPattern(pattern: string): Promise<void>;

  /**
   * Check if key exists in cache
   * @param key Cache key
   */
  exists(key: string): Promise<boolean>;

  /**
   * Clear all cache
   */
  flush(): Promise<void>;

  /**
   * Get remaining TTL for a key
   * @param key Cache key
   * @returns TTL in seconds, -1 if no expiry, -2 if key doesn't exist
   */
  ttl(key: string): Promise<number>;
}
