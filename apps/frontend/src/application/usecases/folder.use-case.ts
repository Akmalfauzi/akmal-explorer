import type { Folder } from '@/domain/entities/folder.entity';
import type { SearchResult, FolderContent } from '@/domain/entities/search.entity';
import type { FolderService } from '@/domain/services/folder.service';

export class FolderUseCase {
  private folderService: FolderService;

  constructor(folderService: FolderService) {
    this.folderService = folderService;
  }

  async loadRootFolders(page = 1, limit = 50) {
    return this.folderService.getRootFolders(page, limit);
  }

  async loadFolderChildren(folderId: string, page = 1, limit = 100) {
    if (!folderId) {
      throw new Error('Folder ID is required');
    }
    return this.folderService.getFolderChildren(folderId, page, limit);
  }

  async loadFolderContent(folderId: string, page = 1, limit = 50): Promise<FolderContent> {
    if (!folderId) {
      throw new Error('Folder ID is required');
    }
    return this.folderService.getFolderContent(folderId, page, limit);
  }

  async searchFiles(query: string, page = 1, type?: 'folder' | 'file'): Promise<SearchResult> {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }
    return this.folderService.searchFolders(query, page, 20, type);
  }

  async navigateToFolder(folderId: string): Promise<Folder> {
    if (!folderId) {
      throw new Error('Folder ID is required');
    }
    return this.folderService.getFolderById(folderId);
  }

  buildFolderPath(folder: Folder, folderCache: Map<string, Folder>): Promise<Folder[]> {
    return this.folderService.buildFolderPath(folder, folderCache);
  }
}