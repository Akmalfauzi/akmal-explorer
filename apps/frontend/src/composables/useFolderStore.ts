import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

import { container } from '@/infrastructure/di/dependency-injection.container';
import { useFolderStore } from '@/presentation/stores/folderStore';

export function useFolderStoreComposable() {
  const folderStore = useFolderStore();

  const {
    rootFolders,
    rootHasMore,
    isLoadingRootFolders,
    selectedFolder,
    breadcrumb,
    currentFolders,
    currentFiles,
    isContentLoading,
    searchQuery,
    searchType,
    searchResults,
    searchFolders,
    searchFiles,
    isSearching,
    totalResults,
    searchTotalPages,
    error
  } = storeToRefs(folderStore);

  // Initialize the store with dependencies
  onMounted(async () => {
    try {
      if (!folderStore.folderUseCase) {
        await folderStore.initializeFolderStore(container.folderUseCase);
      }
    } catch (error) {
      console.error('Error initializing folder store in composable:', error);
    }
  });

  // Actions
  const loadRootFolders = folderStore.loadRootFolders.bind(folderStore);
  const loadMoreRootFolders = folderStore.loadMoreRootFolders.bind(folderStore);
  const selectFolder = folderStore.selectFolder.bind(folderStore);
  const loadFolderContent = folderStore.loadFolderContent.bind(folderStore);
  const loadFolderChildren = folderStore.loadFolderChildren.bind(folderStore);
  const search = folderStore.search.bind(folderStore);
  const setSearchType = folderStore.setSearchType.bind(folderStore);
  const clearSearch = folderStore.clearSearch.bind(folderStore);
  const navigateHome = folderStore.navigateHome.bind(folderStore);
  const navigateBreadcrumb = folderStore.navigateBreadcrumb.bind(folderStore);
  const setError = folderStore.setError.bind(folderStore);
  const clearError = folderStore.clearError.bind(folderStore);

  return {
    // State
    rootFolders,
    rootHasMore,
    isLoadingRootFolders,
    selectedFolder,
    breadcrumb,
    currentFolders,
    currentFiles,
    isContentLoading,
    searchQuery,
    searchType,
    searchResults,
    searchFolders,
    searchFiles,
    isSearching,
    totalResults,
    searchTotalPages,
    error,

    // Actions
    loadRootFolders,
    loadMoreRootFolders,
    selectFolder,
    loadFolderContent,
    loadFolderChildren,
    search,
    setSearchType,
    clearSearch,
    navigateHome,
    navigateBreadcrumb,
    setError,
    clearError,
  };
}