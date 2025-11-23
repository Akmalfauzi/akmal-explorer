import type { RedisOptions } from 'ioredis';

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  retryStrategy?: (times: number) => number | void;
  maxRetriesPerRequest?: number;
  enableReadyCheck?: boolean;
  lazyConnect?: boolean;
}

export const getRedisConfig = (): RedisOptions => {
  const config: RedisOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'akmal-explorer:',
    
    // Retry strategy
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    
    // Maximum retry attempts
    maxRetriesPerRequest: 3,
    
    // Enable ready check
    enableReadyCheck: true,
    
    // Lazy connect - don't connect immediately
    lazyConnect: false,
    
    // Connection timeout
    connectTimeout: 10000,
    
    // Keep alive
    keepAlive: 30000,
  };

  return config;
};

// Default TTL values (in seconds)
export const CACHE_TTL = {
  SHORT: 60,           // 1 minute
  MEDIUM: 300,         // 5 minutes
  LONG: 3600,          // 1 hour
  VERY_LONG: 86400,    // 24 hours
} as const;

// Cache key patterns
export const CACHE_KEYS = {
  FOLDER: (id: string) => `folder:${id}`,
  FOLDER_CONTENT: (id: string, page: number) => `folder:${id}:content:${page}`,
  FOLDER_CHILDREN: (id: string, page: number) => `folder:${id}:children:${page}`,
  ROOT_FOLDERS: (page: number) => `folders:root:${page}`,
  FILE: (id: string) => `file:${id}`,
  SEARCH: (query: string, type: string, page: number) => `search:${type}:${query}:${page}`,
} as const;
