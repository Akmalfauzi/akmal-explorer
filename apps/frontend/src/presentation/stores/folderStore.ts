import { defineStore } from 'pinia';
import type { Folder } from '@/domain/entities/folder.entity';
import type { File } from '@/domain/entities/file.entity';
import type { SearchResult, FolderContent } from '@/domain/entities/search.entity';
import type { FolderUseCase } from '@/application/usecases/folder.use-case';

export interface FolderState {
  // Tree state
  rootFolders: Folder[];
  rootPage: number;
  rootHasMore: boolean;
  isLoadingRootFolders: boolean;

  // Content state
  selectedFolder: Folder | null;
  breadcrumb: Folder[];
  currentContent: FolderContent | null;
  currentContentPage: number;
  isContentLoading: boolean;

  // Search state
  searchQuery: string;
  searchType: 'folder' | 'file';
  searchResults: SearchResult | null;
  isSearching: boolean;
  searchPage: number;
  searchFolderPage: number;
  searchFilePage: number;

  // UI state
  folderCache: Map<string, Folder>;
  contentCache: Map<string, FolderContent>;
  error: string | null;
  // Store reference to useCase
  folderUseCase: any;
}

export const useFolderStore = defineStore('folder', {
  state: (): FolderState => ({
    rootFolders: [],
    rootPage: 1,
    rootHasMore: true,
    isLoadingRootFolders: false,

    selectedFolder: null,
    breadcrumb: [],
    currentContent: null,
    currentContentPage: 1,
    isContentLoading: false,

    searchQuery: '',
    searchType: 'folder',
    searchResults: null,
    isSearching: false,
    searchPage: 1,
    searchFolderPage: 1,
    searchFilePage: 1,

    folderCache: new Map(),
    contentCache: new Map(),
    error: null,
    // Store reference to useCase
    folderUseCase: null as any,
  }),

  getters: {
    totalResults(state): number {
      if (!state.searchResults) return 0;
      return state.searchResults.result?.meta?.total || 0;
    },

    currentFolders(state): Folder[] {
      return state.currentContent?.folders || [];
    },

    currentFiles(state) {
      return state.currentContent?.files || [];
    },

    searchFolders(state): Folder[] {
      if (!state.searchResults || state.searchResults.type !== 'folder') return [];
      return state.searchResults.result?.data as Folder[] || [];
    },

    searchFiles(state): File[] {
      if (!state.searchResults || state.searchResults.type !== 'file') return [];
      return (state.searchResults.result?.data as unknown as File[]) || [];
    },

    searchTotalPages(state): number {
      if (!state.searchResults) return 1;
      return state.searchResults.result?.meta?.totalPages || 1;
    },
  },

  actions: {
    async initializeFolderStore(folderUseCase: FolderUseCase) {
      try {
        this.folderUseCase = folderUseCase;
        this.error = null;
        await this.loadRootFolders();
      } catch (error) {
        console.error('Failed to initialize folder store:', error);
        this.error = error instanceof Error ? error.message : 'Failed to initialize folder store';
      }
    },

    async loadRootFolders(page = 1, limit = 50) {
      try {
        // Prevent duplicate requests
        if (this.isLoadingRootFolders) return;
        
        this.error = null;
        this.isLoadingRootFolders = true;
        
        const response = await this.folderUseCase.loadRootFolders(page, limit);

        if (page === 1) {
          this.rootFolders = response.data;
        } else {
          this.rootFolders.push(...response.data);
        }

        response.data.forEach((folder: Folder) => {
          this.folderCache.set(folder.id, folder);
        });

        this.rootPage = page;
        
        // Check if there's more data
        // Assuming response has total or we can check if we got less than limit
        this.rootHasMore = response.data.length === limit;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load root folders';
        throw error;
      } finally {
        this.isLoadingRootFolders = false;
      }
    },

    async loadMoreRootFolders() {
      if (!this.rootHasMore || this.isLoadingRootFolders) return;
      
      const nextPage = this.rootPage + 1;
      await this.loadRootFolders(nextPage);
    },

    async selectFolder(folder: Folder) {
      try {
        this.error = null;
        this.selectedFolder = folder;

        // Add to cache
        this.folderCache.set(folder.id, folder);

        // Build breadcrumb
        this.breadcrumb = await this.folderUseCase.buildFolderPath(folder, this.folderCache);

        // Load content
        await this.loadFolderContent(folder.id);

        // Clear search
        this.clearSearch();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to select folder';
        throw error;
      }
    },

    async loadFolderContent(folderId: string, page = 1) {
      if (!folderId) {
        throw new Error('Folder ID is required');
      }

      try {
        this.error = null;
        this.isContentLoading = true;

        // Check cache first for page 1
        if (page === 1 && this.contentCache.has(folderId)) {
          this.currentContent = this.contentCache.get(folderId)!;
          this.currentContentPage = page;
          this.isContentLoading = false;
          return;
        }

        const content = await this.folderUseCase.loadFolderContent(folderId, page);

        if (page === 1) {
          this.currentContent = content;
          // Cache the content
          this.contentCache.set(folderId, content);
        } else {
          // Append files for pagination
          if (this.currentContent) {
            this.currentContent.files.push(...content.files);
          }
        }

        content.folders.forEach((folder: Folder) => {
          this.folderCache.set(folder.id, folder);
        });

        this.currentContentPage = page;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load folder content';
        throw error;
      } finally {
        this.isContentLoading = false;
      }
    },

    async search(query: string, page = 1, type?: 'folder' | 'file') {
      try {
        this.error = null;
        this.searchQuery = query;
        
        if (type) {
          this.searchType = type;
        }

        if (!query.trim()) {
          this.clearSearch();
          return;
        }

        this.isSearching = true;

        // Use separate page based on type
        const currentPage = this.searchType === 'folder' ? this.searchFolderPage : this.searchFilePage;
        const pageToUse = page || currentPage;

        const results = await this.folderUseCase.searchFiles(query, pageToUse, this.searchType);
        this.searchResults = results;
        this.searchPage = pageToUse;
        
        // Update page based on type
        if (this.searchType === 'folder') {
          this.searchFolderPage = pageToUse;
        } else {
          this.searchFilePage = pageToUse;
        }

        // Add search results to cache (only if type is folder)
        if (results.type === 'folder') {
          (results.result.data as Folder[]).forEach(folder => {
            this.folderCache.set(folder.id, folder);
          });
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to search';
        throw error;
      } finally {
        this.isSearching = false;
      }
    },

    setSearchType(type: 'folder' | 'file') {
      this.searchType = type;
      // Re-search with current query if exists
      if (this.searchQuery.trim()) {
        this.search(this.searchQuery, 1, type);
      }
    },

    clearSearch() {
      this.searchQuery = '';
      this.searchType = 'folder';
      this.searchResults = null;
      this.isSearching = false;
      this.searchPage = 1;
      this.searchFolderPage = 1;
      this.searchFilePage = 1;
    },

    async loadFolderChildren(folderId: string) {
      try {
        this.error = null;
        const response = await this.folderUseCase.loadFolderChildren(folderId, 1, 100);
        
        response.data.forEach((folder: Folder) => {
          this.folderCache.set(folder.id, folder);
        });
        
        return response.data;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load folder children';
        throw error;
      }
    },

    navigateHome() {
      this.selectedFolder = null;
      this.breadcrumb = [];
      this.currentContent = null;
      this.currentContentPage = 1;
      this.clearSearch();
    },

    navigateBreadcrumb(folder: Folder, index: number) {
      if (index === this.breadcrumb.length - 1) {
        return; // Already on this folder
      }

      this.breadcrumb = this.breadcrumb.slice(0, index + 1);
      this.selectFolder(folder);
    },

    addToCache(folder: Folder) {
      this.folderCache.set(folder.id, folder);
    },

    setError(message: string) {
      this.error = message;
    },

    clearError() {
      this.error = null;
    },
  },
});