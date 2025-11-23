import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { FileCache } from '../../src/infrastructure/cache/file-cache.service';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';

const TEST_CACHE_DIR = '.cache-test';

describe('FileCache', () => {
  let cache: FileCache;

  beforeEach(() => {
    const cacheDir = join(process.cwd(), TEST_CACHE_DIR);
    if (existsSync(cacheDir)) {
      rmSync(cacheDir, { recursive: true, force: true });
    }
    
    cache = new FileCache(TEST_CACHE_DIR);
  });

  afterEach(async () => {
    const cacheDir = join(process.cwd(), TEST_CACHE_DIR);
    if (existsSync(cacheDir)) {
      rmSync(cacheDir, { recursive: true, force: true });
    }
  });

  describe('set and get', () => {
    test('should store and retrieve string value', async () => {
      await cache.set('test-key', 'test-value', 60);
      const result = await cache.get('test-key');
      
      expect(result).toBe('test-value');
    });

    test('should store and retrieve object value', async () => {
      const testObj = { id: 1, name: 'Test', nested: { value: 'data' } };
      
      await cache.set('object-key', testObj, 60);
      const result = await cache.get('object-key');
      
      expect(result).toEqual(testObj);
    });

    test('should return null for non-existent key', async () => {
      const result = await cache.get('non-existent');
      
      expect(result).toBeNull();
    });

    test('should return null for expired key', async () => {
      await cache.set('expired-key', 'value', 0.001);
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const result = await cache.get('expired-key');
      expect(result).toBeNull();
    });
  });

  describe('del', () => {
    test('should delete existing key', async () => {
      await cache.set('delete-key', 'value', 60);
      
      await cache.del('delete-key');
      
      const result = await cache.get('delete-key');
      expect(result).toBeNull();
    });

    test('should not throw error when deleting non-existent key', async () => {
      await expect(cache.del('non-existent')).resolves.toBeUndefined();
    });
  });

  describe('TTL', () => {
    test('should respect TTL configuration', async () => {
      await cache.set('short-lived', 'value', 0.05);
      
      const immediate = await cache.get('short-lived');
      expect(immediate).toBe('value');
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const afterExpiry = await cache.get('short-lived');
      expect(afterExpiry).toBeNull();
    });

    test('should persist value with longer TTL', async () => {
      await cache.set('persistent', 'value', 60);
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const result = await cache.get('persistent');
      expect(result).toBe('value');
    });
  });
});
