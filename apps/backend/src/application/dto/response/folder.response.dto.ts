export interface FolderResponseDto {
  id: string;
  name: string;
  path: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMetaDto {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedFolderResponseDto {
  data: FolderResponseDto[];
  meta: PaginationMetaDto;
}
