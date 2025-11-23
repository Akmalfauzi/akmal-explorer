import type { Folder } from '../entities/folder.entity';
import type { SearchResult, FolderContent } from '../entities/search.entity';
import type { IFolderRepository } from '../repositories/folder.repository.interface';

export class FolderService {
  private readonly folderRepository: IFolderRepository;

  constructor(folderRepository: IFolderRepository) {
    this.folderRepository = folderRepository;
  }

  async getRootFolders(page = 1, limit = 50) {
    return this.folderRepository.getRootFolders(page, limit);
  }

  async getFolderChildren(parentId: string, page = 1, limit = 50) {
    return this.folderRepository.getFolderChildren(parentId, page, limit);
  }

  async getFolderById(folderId: string): Promise<Folder> {
    return this.folderRepository.getFolderById(folderId);
  }

  async getFolderContent(folderId: string, page = 1, limit = 50): Promise<FolderContent> {
    return this.folderRepository.getFolderContent(folderId, page, limit);
  }

  async searchFolders(query: string, page = 1, limit = 20, type?: 'folder' | 'file'): Promise<SearchResult> {
    if (!query.trim()) {
      throw new Error('Search query cannot be empty');
    }
    return this.folderRepository.search(query, page, limit, type);
  }

  async buildFolderPath(folder: Folder, folderCache: Map<string, Folder>): Promise<Folder[]> {
    const path: Folder[] = [];
    let currentFolder: Folder | undefined = folder;

    folderCache.set(folder.id, folder);

    while (currentFolder) {
      path.unshift(currentFolder);

      if (!currentFolder.parentId) {
        break;
      }

      if (folderCache.has(currentFolder.parentId)) {
        currentFolder = folderCache.get(currentFolder.parentId);
      } else {
        try {
          const parentFolder = await this.getFolderById(currentFolder.parentId);
          folderCache.set(parentFolder.id, parentFolder);
          currentFolder = parentFolder;
        } catch (error) {
          console.warn(`Could not fetch parent folder: ${currentFolder.parentId}`);
          break;
        }
      }
    }

    return path;
  }
}