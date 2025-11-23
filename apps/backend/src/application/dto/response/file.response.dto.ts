export interface FileResponseDto {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  path: string;
  folderId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMetaDto {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedFileResponseDto {
  data: FileResponseDto[];
  meta: PaginationMetaDto;
}
