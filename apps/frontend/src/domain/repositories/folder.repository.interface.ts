import type { Folder } from '../entities/folder.entity';
import type { SearchResult, FolderContent } from '../entities/search.entity';

export interface IFolderRepository {
  getRootFolders(page: number, limit: number): Promise<{ data: Folder[]; total: number; page: number; limit: number }>;
  getFolderChildren(parentId: string, page: number, limit: number): Promise<{ data: Folder[]; total: number; page: number; limit: number }>;
  getFolderById(folderId: string): Promise<Folder>;
  getFolderContent(folderId: string, page?: number, limit?: number): Promise<FolderContent>;
  search(query: string, page?: number, limit?: number, type?: 'folder' | 'file'): Promise<SearchResult>;
}