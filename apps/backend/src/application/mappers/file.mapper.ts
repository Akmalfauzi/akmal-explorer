import type { FileResponseDto, PaginatedFileResponseDto } from '@/application/dto/response/file.response.dto';

export class FileMapper {
  static toDto(file: any): FileResponseDto {
    return {
      id: file.id,
      name: file.name,
      size: file.size,
      mimeType: file.mimeType,
      path: file.path,
      folderId: file.folderId,
      createdAt: file.createdAt instanceof Date ? file.createdAt.toISOString() : file.createdAt,
      updatedAt: file.updatedAt instanceof Date ? file.updatedAt.toISOString() : file.updatedAt,
    };
  }

  static toDtoList(files: any[]): FileResponseDto[] {
    return files.map(file => this.toDto(file));
  }

  static toPaginatedDto(result: { data: any[]; total: number; page: number; limit: number }): PaginatedFileResponseDto {
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
