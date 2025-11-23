import type { FolderResponseDto } from '@/application/dto/response/folder.response.dto';
import type { FileResponseDto } from '@/application/dto/response/file.response.dto';

export interface PaginationMetaDto {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchResultDto<T> {
  data: T[];
  meta: PaginationMetaDto;
}

export interface SearchResponseDto {
  query: string;
  type: 'folder' | 'file';
  result: SearchResultDto<FolderResponseDto> | SearchResultDto<FileResponseDto>;
}
