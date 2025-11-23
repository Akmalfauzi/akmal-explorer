import type { FolderResponseDto, PaginatedFolderResponseDto } from '@/application/dto/response/folder.response.dto';

export class FolderMapper {
  static toDto(folder: any): FolderResponseDto {
    return {
      id: folder.id,
      name: folder.name,
      path: folder.path,
      parentId: folder.parentId,
      createdAt: folder.createdAt instanceof Date ? folder.createdAt.toISOString() : folder.createdAt,
      updatedAt: folder.updatedAt instanceof Date ? folder.updatedAt.toISOString() : folder.updatedAt,
    };
  }

  static toDtoList(folders: any[]): FolderResponseDto[] {
    return folders.map(folder => this.toDto(folder));
  }

  static toPaginatedDto(result: { data: any[]; total: number; page: number; limit: number }): PaginatedFolderResponseDto {
    return {
      data: this.toDtoList(result.data),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
    };
  }
}
