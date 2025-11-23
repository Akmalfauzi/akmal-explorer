import type { FolderContentResponseDto } from '@/application/dto/response/folder-content.response.dto';
import { FolderMapper } from '@/application/mappers/folder.mapper';
import { FileMapper } from '@/application/mappers/file.mapper';

export class FolderContentMapper {
  static toDto(content: {
    folders: { data: any[]; total: number; page: number; limit: number };
    files: { data: any[]; total: number; page: number; limit: number };
  }): FolderContentResponseDto {
    return {
      data: {
        folders: {
          data: FolderMapper.toDtoList(content.folders.data),
          meta: {
            total: content.folders.total,
            page: content.folders.page,
            limit: content.folders.limit,
            totalPages: Math.ceil(content.folders.total / content.folders.limit),
          },
        },
        files: {
          data: FileMapper.toDtoList(content.files.data),
          meta: {
            total: content.files.total,
            page: content.files.page,
            limit: content.files.limit,
            totalPages: Math.ceil(content.files.total / content.files.limit),
          },
        },
      },
    };
  }
}
