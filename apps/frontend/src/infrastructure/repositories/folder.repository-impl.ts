import type { Folder } from '@/domain/entities/folder.entity';
import type { SearchResult, PaginationMeta, FolderContent } from '@/domain/entities/search.entity';
import type { File } from '@/domain/entities/file.entity';
import type { IFolderRepository } from '@/domain/repositories/folder.repository.interface';
import { HttpClient } from '@/infrastructure/http/http-client';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

interface FolderResponseDto {
  id: string;
  name: string;
  path: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface FileResponseDto {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  folderId: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationMetaDto {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PaginatedDataDto<T> {
  data: T[];
  meta: PaginationMetaDto;
}

interface SimplePaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

interface FolderContentResponseData {
  data: {
    folders: PaginatedDataDto<FolderResponseDto>;
    files: PaginatedDataDto<FileResponseDto>;
  };
}

interface SearchResponseDto {
  query: string;
  type: 'folder' | 'file';
  result: {
    data: FolderResponseDto[] | FileResponseDto[];
    meta: PaginationMetaDto;
  };
}

export class FolderRepositoryImpl implements IFolderRepository {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getRootFolders(page = 1, limit = 50) {
    const response = await this.httpClient.get<ApiResponse<SimplePaginatedResponse<FolderResponseDto>>>(
      '/folders/tree',
      { params: { page, limit } }
    );

    return {
      data: response.data.data.data.map(this.mapToFolder),
      total: response.data.data.total,
      page: response.data.data.page,
      limit: response.data.data.limit
    };
  }

  async getFolderChildren(parentId: string, page = 1, limit = 50) {
    const response = await this.httpClient.get<ApiResponse<SimplePaginatedResponse<FolderResponseDto>>>(
      `/folders/${parentId}/children`,
      { params: { page, limit } }
    );

    return {
      data: response.data.data.data.map(this.mapToFolder),
      total: response.data.data.total,
      page: response.data.data.page,
      limit: response.data.data.limit
    };
  }

  async getFolderById(folderId: string): Promise<Folder> {
    const response = await this.httpClient.get<ApiResponse<FolderResponseDto>>(
      `/folders/${folderId}`
    );
    return this.mapToFolder(response.data.data);
  }

  async getFolderContent(folderId: string, page = 1, limit = 50): Promise<FolderContent> {
    const response = await this.httpClient.get<ApiResponse<FolderContentResponseData>>(
      `/folders/${folderId}/content`,
      { params: { page, limit } }
    );

    return {
      folders: response.data.data.data.folders.data.map(this.mapToFolder),
      files: response.data.data.data.files.data.map(this.mapToFile),
      meta: this.mapToPaginationMeta(response.data.data.data.folders.meta)
    };
  }

  async search(query: string, page = 1, limit = 20, type?: 'folder' | 'file'): Promise<SearchResult> {
    const params: any = { q: query, page, limit };
    if (type) {
      params.type = type;
    }
    
    const response = await this.httpClient.get<ApiResponse<SearchResponseDto>>(
      '/search',
      { params }
    );

    const searchData = response.data.data;
    
    // Map based on type
    if (searchData.type === 'folder') {
      return {
        query: searchData.query,
        type: 'folder',
        result: {
          data: (searchData.result.data as FolderResponseDto[]).map(this.mapToFolder),
          meta: this.mapToPaginationMeta(searchData.result.meta)
        }
      };
    } else {
      return {
        query: searchData.query,
        type: 'file',
        result: {
          data: (searchData.result.data as FileResponseDto[]).map(this.mapToFile),
          meta: this.mapToPaginationMeta(searchData.result.meta)
        }
      };
    }
  }

  private mapToFolder = (dto: FolderResponseDto): Folder => {
    return {
      id: dto.id,
      name: dto.name,
      parentId: dto.parentId,
      path: dto.path,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt)
    };
  }

  private mapToFile = (dto: FileResponseDto): File => {
    return {
      id: dto.id,
      name: dto.name,
      folderId: dto.folderId,
      size: dto.size,
      mimeType: dto.mimeType,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt)
    };
  }

  private mapToPaginationMeta = (meta: PaginationMetaDto): PaginationMeta => {
    return {
      total: meta.total,
      page: meta.page,
      limit: meta.limit,
      totalPages: meta.totalPages
    };
  }
}