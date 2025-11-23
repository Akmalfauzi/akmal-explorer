import type { IFolderRepository } from '@/domain/repositories/folder.repository.interface';
import type { IFileRepository } from '@/domain/repositories/file.repository.interface';
import type { SearchResponseDto } from '@/application/dto/response/search.response.dto';
import { SearchMapper } from '@/application/mappers/search.mapper';

export class SearchUseCase {
  constructor(
    private folderRepo: IFolderRepository,
    private fileRepo: IFileRepository
  ) { }

  async execute(query: string, page: number = 1, limit: number = 20, type?: 'folder' | 'file'): Promise<SearchResponseDto> {

    if (type === 'folder') {
      const foldersResult = await this.folderRepo.searchByName(query, page, limit);
      return SearchMapper.toFolderDto({
        query,
        data: foldersResult.data,
        meta: {
          total: foldersResult.total,
          page: foldersResult.page,
          limit: foldersResult.limit,
          totalPages: Math.ceil(foldersResult.total / limit)
        }
      });
    }
    
    if (type === 'file') {
      const filesResult = await this.fileRepo.searchByName(query, page, limit);
      return SearchMapper.toFileDto({
        query,
        data: filesResult.data,
        meta: {
          total: filesResult.total,
          page: filesResult.page,
          limit: filesResult.limit,
          totalPages: Math.ceil(filesResult.total / limit)
        }
      });
    }

    // Default to folder
    const foldersResult = await this.folderRepo.searchByName(query, page, limit);
    return SearchMapper.toFolderDto({
      query,
      data: foldersResult.data,
      meta: {
        total: foldersResult.total,
        page: foldersResult.page,
        limit: foldersResult.limit,
        totalPages: Math.ceil(foldersResult.total / limit)
      }
    });
  }
}