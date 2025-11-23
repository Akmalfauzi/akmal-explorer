import { HttpClient } from '../http/http-client';
import { FolderRepositoryImpl } from '../repositories/folder.repository-impl';
import { FolderService } from '../../domain/services/folder.service';
import { FolderUseCase } from '../../application/usecases/folder.use-case';

export class Container {
  private static instance: Container;
  private _httpClient!: HttpClient;
  private _folderRepository!: FolderRepositoryImpl;
  private _folderService!: FolderService;
  private _folderUseCase!: FolderUseCase;

  private constructor() {
    this.initialize();
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  private initialize() {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const apiPrefix = import.meta.env.VITE_API_PREFIX || '/api';
    const apiVersion = import.meta.env.VITE_API_VERSION || '/v1';

    this._httpClient = new HttpClient({ baseURL: `${baseURL}${apiPrefix}${apiVersion}` });
    this._folderRepository = new FolderRepositoryImpl(this._httpClient);

    this._folderService = new FolderService(this._folderRepository);

    this._folderUseCase = new FolderUseCase(this._folderService);
  }

  get httpClient(): HttpClient {
    return this._httpClient;
  }

  get folderRepository(): FolderRepositoryImpl {
    return this._folderRepository;
  }

  get folderService(): FolderService {
    return this._folderService;
  }

  get folderUseCase(): FolderUseCase {
    return this._folderUseCase;
  }
}

export const container = Container.getInstance();