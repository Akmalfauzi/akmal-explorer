// File Entity
export interface IFile {
  id: string;
  name: string;
  folderId: string;
  size: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

// Folder Entity
export interface IFolder {
  id: string;
  name: string;
  parentId: string | null;
  path: string;
  createdAt: Date;
  updatedAt: Date;
}

// Pagination Meta
export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Search Result
export interface ISearchResult {
  query: string;
  type: 'folder' | 'file';
  result: {
    data: IFolder[] | IFile[];
    meta: IPaginationMeta;
  };
}

// Folder Content
export interface IFolderContent {
  folders: IFolder[];
  files: IFile[];
  meta: IPaginationMeta;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}
