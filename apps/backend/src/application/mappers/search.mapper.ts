import type { SearchResponseDto } from '@/application/dto/response/search.response.dto';
import { FolderMapper } from '@/application/mappers/folder.mapper';
import { FileMapper } from '@/application/mappers/file.mapper';

export class SearchMapper {
  static toFolderDto(searchResult: {
    query: string;
    data: any[];
    meta: any;
  }): SearchResponseDto {
    return {
      query: searchResult.query,
      type: 'folder',
      result: {
        data: FolderMapper.toDtoList(searchResult.data),
        meta: searchResult.meta,
      },
    };
  }

  static toFileDto(searchResult: {
    query: string;
    data: any[];
    meta: any;
  }): SearchResponseDto {
    return {
      query: searchResult.query,
      type: 'file',
      result: {
        data: FileMapper.toDtoList(searchResult.data),
        meta: searchResult.meta,
      },
    };
  }
}
