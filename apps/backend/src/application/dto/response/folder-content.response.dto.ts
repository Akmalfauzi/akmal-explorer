import type { FolderResponseDto } from '@/application/dto/response/folder.response.dto';
import type { FileResponseDto } from '@/application/dto/response/file.response.dto';

export interface PaginationMetaDto {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedDataDto<T> {
  data: T[];
  meta: PaginationMetaDto;
}

export interface FolderContentDataDto {
  folders: PaginatedDataDto<FolderResponseDto>;
  files: PaginatedDataDto<FileResponseDto>;
}

export interface FolderContentResponseDto {
  data: FolderContentDataDto;
}
