import { db } from '@/infrastructure/db';
import { files } from '@/infrastructure/db/schema';
import { eq, ilike, asc, sql } from 'drizzle-orm';
import type { IFile } from '@repo/shared';
import type { IFileRepository, PaginatedResult } from '@/domain/repositories/file.repository.interface';
import type { ICache } from '@/domain/services/cache.interface';
import { CACHE_KEYS, CACHE_TTL } from '@/infrastructure/cache/redis.config';

export class FileRepository implements IFileRepository {
  constructor(private cache: ICache) {}

  async findByFolderId(folderId: string, page: number, limit: number): Promise<PaginatedResult<IFile>> {
    const cacheKey = CACHE_KEYS.FOLDER_CONTENT(folderId, page);

    // Try to get from cache
    try {
      const cached = await this.cache.get<PaginatedResult<IFile>>(cacheKey);
      if (cached) {
        return cached;
      }
    } catch {
      // Cache error, continue to database
    }

    const offset = (page - 1) * limit;

    const data = await db.select()
      .from(files)
      .where(eq(files.folderId, folderId))
      .orderBy(asc(files.name))
      .limit(limit)
      .offset(offset);

    const [countRes] = await db.select({ count: sql<number>`count(*)` })
      .from(files)
      .where(eq(files.folderId, folderId));

    const result = {
      data: data as unknown as IFile[],
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

  async searchByName(query: string, page: number, limit: number): Promise<PaginatedResult<IFile>> {
    const cacheKey = CACHE_KEYS.SEARCH(query, 'file', page);

    // Try to get from cache
    try {
      const cached = await this.cache.get<PaginatedResult<IFile>>(cacheKey);
      if (cached) {
        return cached;
      }
    } catch {
      // Cache error, continue to database
    }

    const offset = (page - 1) * limit;

    const data = await db.select()
      .from(files)
      .where(ilike(files.name, `%${query}%`))
      .orderBy(asc(files.name))
      .limit(limit)
      .offset(offset);

    const [countRes] = await db.select({ count: sql<number>`count(*)` })
      .from(files)
      .where(ilike(files.name, `%${query}%`));

    const result = {
      data: data as unknown as IFile[],
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