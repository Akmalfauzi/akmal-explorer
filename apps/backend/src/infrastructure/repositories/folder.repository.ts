import { db } from '@/infrastructure/db';
import { folders } from '@/infrastructure/db/schema';
import { eq, ilike, asc, isNull, sql } from 'drizzle-orm';
import type { IFolder } from '@repo/shared';
import type { IFolderRepository, PaginatedResult } from '@/domain/repositories/folder.repository.interface';
import type { ICache } from '@/domain/services/cache.interface';
import { CACHE_KEYS, CACHE_TTL } from '@/infrastructure/cache/redis.config';

export class FolderRepository implements IFolderRepository {
  constructor(private cache: ICache) {}

  async findRoots(page: number, limit: number): Promise<PaginatedResult<IFolder>> {
    const cacheKey = CACHE_KEYS.ROOT_FOLDERS(page);

    // Try to get from cache
    try {
      const cached = await this.cache.get<PaginatedResult<IFolder>>(cacheKey);
      if (cached) {
        return cached;
      }
    } catch {
      // Cache error, continue to database
    }

    const offset = (page - 1) * limit;

    const data = await db.select()
      .from(folders)
      .where(isNull(folders.parentId))
      .orderBy(asc(folders.name))
      .limit(limit)
      .offset(offset);

    const [countRes] = await db.select({ count: sql<number>`count(*)` })
      .from(folders)
      .where(isNull(folders.parentId));

    const result = {
      data: data as unknown as IFolder[],
      total: Number(countRes?.count || 0),
      page,
      limit
    };

    // Store in cache
    try {
      await this.cache.set(cacheKey, result, CACHE_TTL.MEDIUM);
    } catch {
      // Cache error, ignore
    }

    return result;
  }

  async findByParentId(parentId: string, page: number, limit: number): Promise<PaginatedResult<IFolder>> {
    const cacheKey = CACHE_KEYS.FOLDER_CHILDREN(parentId, page);

    // Try to get from cache
    try {
      const cached = await this.cache.get<PaginatedResult<IFolder>>(cacheKey);
      if (cached) {
        return cached;
      }
    } catch {
      // Cache error, continue to database
    }

    const offset = (page - 1) * limit;

    const data = await db.select()
      .from(folders)
      .where(eq(folders.parentId, parentId))
      .orderBy(asc(folders.name))
      .limit(limit)
      .offset(offset);

    const [countRes] = await db.select({ count: sql<number>`count(*)` })
      .from(folders)
      .where(eq(folders.parentId, parentId));

    const result = {
      data: data as unknown as IFolder[],
      total: Number(countRes?.count || 0),
      page,
      limit
    };

    // Store in cache
    try {
      await this.cache.set(cacheKey, result, CACHE_TTL.MEDIUM);
    } catch {
      // Cache error, ignore
    }

    return result;
  }

  async findById(id: string): Promise<IFolder | undefined> {
    const cacheKey = CACHE_KEYS.FOLDER(id);

    // Try to get from cache
    try {
      const cached = await this.cache.get<IFolder>(cacheKey);
      if (cached) {
        return cached;
      }
    } catch {
      // Cache error, continue to database
    }

    try {
      const [res] = await db.select().from(folders).where(eq(folders.id, id));
      const result = res as unknown as IFolder | undefined;
      
      // Store in cache if found
      if (result) {
        try {
          await this.cache.set(cacheKey, result, CACHE_TTL.LONG);
        } catch {
          // Cache error, ignore
        }
      }
      
      return result;
    } catch (error) {
      const dbError = new Error(`Database query failed: ${(error as any)?.message || String(error)}`);
      (dbError as any).originalError = error;
      throw dbError;
    };
  }

  async searchByName(query: string, page: number, limit: number): Promise<PaginatedResult<IFolder>> {
    const cacheKey = CACHE_KEYS.SEARCH(query, 'folder', page);

    // Try to get from cache
    try {
      const cached = await this.cache.get<PaginatedResult<IFolder>>(cacheKey);
      if (cached) {
        return cached;
      }
    } catch {
      // Cache error, continue to database
    }

    const offset = (page - 1) * limit;

    const data = await db.select()
      .from(folders)
      .where(ilike(folders.name, `%${query}%`))
      .orderBy(asc(folders.name))
      .limit(limit)
      .offset(offset);

    const [countRes] = await db.select({ count: sql<number>`count(*)` })
      .from(folders)
      .where(ilike(folders.name, `%${query}%`));

    const result = {
      data: data as unknown as IFolder[],
      total: Number(countRes?.count || 0),
      page,
      limit
    };

    // Store in cache with shorter TTL for search results
    try {
      await this.cache.set(cacheKey, result, CACHE_TTL.SHORT);
    } catch {
      // Cache error, ignore
    }

    return result;
  }
}