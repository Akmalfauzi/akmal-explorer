import type { IFolderRepository } from '@/domain/repositories/folder.repository.interface';
import type { IFileRepository } from '@/domain/repositories/file.repository.interface';
import type { FolderContentResponseDto } from '@/application/dto/response/folder-content.response.dto';
import { FolderContentMapper } from '@/application/mappers/folder-content.mapper';

export class GetFolderContentUseCase {
  constructor(
    private folderRepo: IFolderRepository,
    private fileRepo: IFileRepository
  ) { }

  async execute(folderId: string, page: number = 1, limit: number = 50): Promise<FolderContentResponseDto> {
    const [foldersResult, filesResult] = await Promise.all([
      this.folderRepo.findByParentId(folderId, page, limit),
      this.fileRepo.findByFolderId(folderId, page, limit)
    ]);

    return FolderContentMapper.toDto({
      folders: foldersResult,
      files: filesResult,
    });
  }
}