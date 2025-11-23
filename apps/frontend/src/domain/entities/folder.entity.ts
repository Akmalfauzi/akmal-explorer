import type { IFolder } from '@repo/shared';

export type Folder = IFolder;

export interface FolderTree extends Folder {
  children: Folder[];
}

export interface FolderWithChildren extends Folder {
  children: Folder[];
  hasMoreChildren: boolean;
  totalChildren: number;
}