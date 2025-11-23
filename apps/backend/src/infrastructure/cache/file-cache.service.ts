import type { ICache } from '@/domain/services/cache.interface';
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, unlinkSync, statSync } from 'fs';
import { join } from 'path';

interface CacheEntry<T> {
  value: T;
  expiry: number;
}

export class FileCache implements ICache {
  private cacheDir: string;
  private cleanupInterval: NodeJS.Timeout;

  constructor(cacheDir: string = '.cache') {
    this.cacheDir = join(process.cwd(), cacheDir);
    
    if (!existsSync(this.cacheDir)) {
      mkdirSync(this.cacheDir, { recursive: true });
      console.log(`✅ File cache directory created: ${this.cacheDir}`);
    } else {
      console.log(`✅ File cache initialized: ${this.cacheDir}`);
    }

    this.cleanupInterval = setInterval(() => {
      this.cleanupExpired();
    }, 60000);
  }

  private getFilePath(key: string): string {
    const safeKey = Buffer.from(key).toString('base64').replace(/[/+=]/g, '_');
    return join(this.cacheDir, `${safeKey}.json`);
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const filePath = this.getFilePath(key);
      
      if (!existsSync(filePath)) {
        return null;
      }

      const content = readFileSync(filePath, 'utf-8');
      const entry: CacheEntry<T> = JSON.parse(content);

      if (Date.now() > entry.expiry) {
        await this.del(key);
        return null;
      }

      console.log(`✅ Cache hit: ${key}`);
      return entry.value;
    } catch (error) {
      console.error(`❌ File cache get error for key "${key}":`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    try {
      const filePath = this.getFilePath(key);
      const entry: CacheEntry<T> = {
        value,
        expiry: Date.now() + (ttl * 1000)
      };

      writeFileSync(filePath, JSON.stringify(entry), 'utf-8');
      console.log(`✅ Cache set: ${key} (TTL: ${ttl}s)`);
    } catch (error) {
      console.error(`❌ File cache set error for key "${key}":`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      const filePath = this.getFilePath(key);
      
      if (existsSync(filePath)) {
        unlinkSync(filePath);
        console.log(`✅ Cache deleted: ${key}`);
      }
    } catch (error) {
      console.error(`❌ File cache del error for key "${key}":`, error);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      
      const files = readdirSync(this.cacheDir);
      let deleted = 0;
      
      for (const file of files) {
        const base64Key = file.replace(/\.json$/, '').replace(/_/g, '+');
        const key = Buffer.from(base64Key, 'base64').toString('utf-8');
        
        if (regex.test(key)) {
          const filePath = join(this.cacheDir, file);
          unlinkSync(filePath);
          deleted++;
        }
      }
      
      if (deleted > 0) {
        console.log(`✅ Cache pattern deleted: ${pattern} (${deleted} entries)`);
      }
    } catch (error) {
      console.error(`❌ File cache delPattern error for pattern "${pattern}":`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const filePath = this.getFilePath(key);
      
      if (!existsSync(filePath)) {
        return false;
      }

      const content = readFileSync(filePath, 'utf-8');
      const entry: CacheEntry<unknown> = JSON.parse(content);

      if (Date.now() > entry.expiry) {
        await this.del(key);
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async flush(): Promise<void> {
    try {
      const files = readdirSync(this.cacheDir);
      
      for (const file of files) {
        const filePath = join(this.cacheDir, file);
        unlinkSync(filePath);
      }
      
      console.log(`✅ Cache flushed: ${files.length} entries cleared`);
    } catch (error) {
      console.error('❌ File cache flush error:', error);
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      const filePath = this.getFilePath(key);
      
      if (!existsSync(filePath)) {
        return -2;
      }

      const content = readFileSync(filePath, 'utf-8');
      const entry: CacheEntry<unknown> = JSON.parse(content);

      const remaining = Math.floor((entry.expiry - Date.now()) / 1000);
      
      if (remaining <= 0) {
        await this.del(key);
        return -2;
      }

      return remaining;
    } catch (error) {
      return -2;
    }
  }

  private cleanupExpired(): void {
    try {
      const files = readdirSync(this.cacheDir);
      let cleaned = 0;

      for (const file of files) {
        const filePath = join(this.cacheDir, file);
        
        try {
          const content = readFileSync(filePath, 'utf-8');
          const entry: CacheEntry<unknown> = JSON.parse(content);

          if (Date.now() > entry.expiry) {
            unlinkSync(filePath);
            cleaned++;
          }
        } catch (error) {
          unlinkSync(filePath);
          cleaned++;
        }
      }

      if (cleaned > 0) {
        console.log(`🧹 Cleaned up ${cleaned} expired cache entries`);
      }
    } catch (error) {
      console.error('❌ File cache cleanup error:', error);
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }

  async stats(): Promise<{ count: number; size: number }> {
    try {
      const files = readdirSync(this.cacheDir);
      let totalSize = 0;

      for (const file of files) {
        const filePath = join(this.cacheDir, file);
        const stats = statSync(filePath);
        totalSize += stats.size;
      }

      return {
        count: files.length,
        size: totalSize
      };
    } catch (error) {
      return { count: 0, size: 0 };
    }
  }
}
