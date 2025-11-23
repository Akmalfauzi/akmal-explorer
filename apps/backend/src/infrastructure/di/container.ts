import { FolderRepository } from '@/infrastructure/repositories/folder.repository';
import { FileRepository } from '@/infrastructure/repositories/file.repository';
import { GetTreeUseCase } from '@/application/use-cases/folder/get-tree.use-case';
import { GetFolderContentUseCase } from '@/application/use-cases/folder/get-folder-content.use-case';
import { SearchUseCase } from '@/application/use-cases/explorer/search.use-case';
import type { ICache } from '@/domain/services/cache.interface';
import { CacheFactory } from '@/infrastructure/cache/cache-factory';

export class Container {
  private static instance: Container;

  public readonly cache: ICache;
  public readonly folderRepository: FolderRepository;
  public readonly fileRepository: FileRepository;

  public readonly getTreeUseCase: GetTreeUseCase;
  public readonly getFolderContentUseCase: GetFolderContentUseCase;
  public readonly searchUseCase: SearchUseCase;

  private constructor() {
    this.cache = CacheFactory.create();

    this.folderRepository = new FolderRepository(this.cache);
    this.fileRepository = new FileRepository(this.cache);

    this.getTreeUseCase = new GetTreeUseCase(this.folderRepository);
    this.getFolderContentUseCase = new GetFolderContentUseCase(this.folderRepository, this.fileRepository);
    this.searchUseCase = new SearchUseCase(this.folderRepository, this.fileRepository);
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }
}

export const container = Container.getInstance();
