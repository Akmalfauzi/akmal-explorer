import type { IFolderRepository } from '../../../domain/repositories/folder.repository.interface';
import type { PaginatedFolderResponseDto } from '../../dto/response/folder.response.dto';
import { FolderMapper } from '../../mappers/folder.mapper';

export class GetTreeUseCase {
  constructor(private folderRepo: IFolderRepository) { }

  async execute(page: number = 1, limit: number = 50): Promise<PaginatedFolderResponseDto> {
    const result = await this.folderRepo.findRoots(page, limit);
    return FolderMapper.toPaginatedDto(result);
  }
}