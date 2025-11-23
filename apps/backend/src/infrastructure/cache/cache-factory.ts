import type { ICache } from '@/domain/services/cache.interface';
import { RedisCache } from './redis-cache.service';
import { FileCache } from './file-cache.service';

export class CacheFactory {
  static create(): ICache {
    const cacheProvider = process.env.CACHE_PROVIDER || 'file';

    switch (cacheProvider.toLowerCase()) {
      case 'redis':
        try {
          console.log('🔧 Initializing Redis cache...');
          return new RedisCache();
        } catch (error) {
          console.error('⚠️ Failed to initialize Redis, falling back to File cache:', error);
          return new FileCache();
        }
      
      case 'file':
        try {
          console.log('🔧 Initializing File cache...');
          return new FileCache();
        } catch (error) {
          console.error('⚠️ Failed to initialize File cache:', error);
          throw error;
        }

      default:
        console.warn(`⚠️ Unknown cache provider: ${cacheProvider}, using File cache`);
        try {
          return new FileCache();
        } catch (error) {
          console.error('⚠️ Failed to initialize File cache:', error);
          throw error;
        }
    }
  }
}
