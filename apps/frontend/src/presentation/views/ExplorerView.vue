<script setup lang="ts">
import { watch, ref } from 'vue';
import { useFolderStoreComposable } from '@/composables/useFolderStore';
import { debounce } from '@/infrastructure/utils/performance';
import ErrorDisplay from '@/presentation/components/common/ErrorDisplay.vue';
import DetailsModal from '@/presentation/components/common/DetailsModal.vue';
import AppHeader from '@/presentation/components/common/AppHeader.vue';
import NavigationPanel from '@/presentation/components/common/NavigationPanel.vue';
import ContentPanel from '@/presentation/components/common/ContentPanel.vue';

const {
  rootFolders,
  rootHasMore,
  isLoadingRootFolders,
  selectedFolder,
  breadcrumb,
  currentFolders,
  currentFiles,
  isContentLoading,
  searchQuery: storeSearchQuery,
  searchType,
  searchResults,
  searchFolders,
  searchFiles,
  isSearching,
  totalResults,
  error,
  selectFolder,
  loadFolderContent,
  loadFolderChildren,
  loadMoreRootFolders,
  search,
  setSearchType,
  clearSearch,
  navigateHome,
  navigateBreadcrumb,
  clearError,
} = useFolderStoreComposable();

const loadingMore = ref(false);
const showDetailsModal = ref(false);
const selectedItem = ref<any>(null);
const desktopNavigationRef = ref<InstanceType<typeof NavigationPanel>>();
const mobileNavigationRef = ref<InstanceType<typeof NavigationPanel>>();
const isMobileMenuOpen = ref(false);

// Shared state untuk mobile dan desktop navigation
const expandedFolders = ref<Set<string>>(new Set());
const loadingFolders = ref<Set<string>>(new Set());
const folderChildren = ref<Map<string, any[]>>(new Map());

const setFolderChildren = (folderId: string, children: any[]) => {
  folderChildren.value.set(folderId, children);
  loadingFolders.value.delete(folderId);

  // Update kedua refs
  desktopNavigationRef.value?.setFolderChildren(folderId, children);
  mobileNavigationRef.value?.setFolderChildren(folderId, children);
};

// Local search query and type for v-model binding
const localSearchQuery = ref('');
const localSearchType = ref<'folder' | 'file'>('folder');

const debouncedSearch = debounce(async (query: string) => {
  try {
    if (query.trim()) {
      await search(query, 1);
    } else {
      clearSearch();
    }
  } catch (error) {
    console.error('Search error:', error);
  }
}, 500);

watch(localSearchQuery, (newVal) => {
  debouncedSearch(newVal);
});

// Watch searchType changes
watch(localSearchType, (newType) => {
  setSearchType(newType);
});

const onFolderSelect = async (folder: any) => {
  try {
    await selectFolder(folder);
  } catch (error) {
    console.error('Error selecting folder:', error);
  }
};

const onFolderClick = async (folder: any) => {
  try {
    await selectFolder(folder);
  } catch (error) {
    console.error('Error clicking folder:', error);
  }
};

const onLoadMoreFiles = async () => {
  if (loadingMore.value || !selectedFolder.value) return;

  try {
    loadingMore.value = true;
    const nextPage = (currentFolders.value.length / 50) + 1;
    await loadFolderContent(selectedFolder.value.id, nextPage);
  } catch (error) {
    console.error('Error loading more files:', error);
  } finally {
    loadingMore.value = false;
  }
};

const onBreadcrumbClick = (folder: any, index: number) => {
  navigateBreadcrumb(folder, index);
};

const onSearchPageChange = async (page: number, query: string) => {
  try {
    await search(query, page);
  } catch (error) {
    console.error('Error changing search page:', error);
  }
};

const onSearchTypeChange = (type: 'folder' | 'file') => {
  setSearchType(type);
};

const onHomeClick = () => {
  navigateHome();
};

const onLoadChildren = async (folderId: string) => {
  try {
    const children = await loadFolderChildren(folderId);
    setFolderChildren(folderId, children);
  } catch (error) {
    console.error('Error loading folder children:', error);
    // Remove from loading state on error
    loadingFolders.value.delete(folderId);
    desktopNavigationRef.value?.setFolderChildren(folderId, []);
    mobileNavigationRef.value?.setFolderChildren(folderId, []);
  }
};

const onLoadMoreNavigation = async () => {
  try {
    await loadMoreRootFolders();
  } catch (error) {
    console.error('Error loading more root folders:', error);
  }
};

const onFolderToggle = (folder: any) => {
  const folderId = folder.id;

  if (expandedFolders.value.has(folderId)) {
    expandedFolders.value.delete(folderId);
  } else {
    expandedFolders.value.add(folderId);

    if (!folderChildren.value.has(folderId)) {
      loadingFolders.value.add(folderId);
      onLoadChildren(folderId);
    }
  }
};

const onContextMenuAction = ({ action, item, type }: { action: string; item: any; type: 'file' | 'folder' }) => {
  switch (action) {
    case 'open':
      if (type === 'folder') {
        onFolderClick(item);
      }
      break;

    case 'details':
      selectedItem.value = item;
      showDetailsModal.value = true;
      break;

    case 'download':
      if (type === 'file') {
        console.log('Download file:', item);
      }
      break;

    case 'rename':
      console.log('Rename:', item);
      break;

    case 'delete':
      console.log('Delete:', item);
      break;
  }
};
</script>

<template>
  <div class="flex flex-col h-screen w-full bg-gray-50 text-gray-800 font-sans overflow-hidden">
    <AppHeader v-model:search-query="localSearchQuery" v-model:search-type="localSearchType" />

    <ErrorDisplay v-if="error" :message="error" @close="clearError" />

    <!-- Mobile Menu Toggle Button -->
    <div class="md:hidden bg-white border-b px-4 py-2 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <svg v-if="!isMobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span class="text-sm font-medium text-gray-700">
          {{ selectedFolder ? (selectedFolder.name || 'Root') : 'Pilih folder' }}
        </span>
      </div>
    </div>

    <!-- Mobile Navigation Overlay -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden fixed inset-0 backdrop-blur-sm bg-white/30 z-40"
      @click="isMobileMenuOpen = false"
    >
      <div
        class="w-80 max-w-[85vw] h-full bg-white shadow-xl"
        @click.stop
      >
        <NavigationPanel
          ref="mobileNavigationRef"
          :root-folders="rootFolders"
          :selected-folder="selectedFolder"
          :has-more="rootHasMore"
          :is-loading-more="isLoadingRootFolders"
          :expanded-folders="expandedFolders"
          :loading-folders="loadingFolders"
          :folder-children="folderChildren"
          @home-click="() => { onHomeClick(); isMobileMenuOpen = false; }"
          @folder-select="(folder) => { onFolderSelect(folder); isMobileMenuOpen = false; }"
          @folder-toggle="onFolderToggle"
          @load-more="onLoadMoreNavigation"
        />
      </div>
    </div>

    <!-- Desktop Layout -->
    <div class="hidden md:flex flex-1 overflow-hidden">
      <NavigationPanel
        ref="desktopNavigationRef"
        :root-folders="rootFolders"
        :selected-folder="selectedFolder"
        :has-more="rootHasMore"
        :is-loading-more="isLoadingRootFolders"
        :expanded-folders="expandedFolders"
        :loading-folders="loadingFolders"
        :folder-children="folderChildren"
        @home-click="onHomeClick"
        @folder-select="onFolderSelect"
        @folder-toggle="onFolderToggle"
        @load-more="onLoadMoreNavigation"
      />

      <ContentPanel
        :is-searching="isSearching"
        :search-query="storeSearchQuery"
        :search-type="searchType"
        :search-folders="searchFolders"
        :search-files="searchFiles"
        :total-results="totalResults"
        :selected-folder="selectedFolder"
        :current-folders="currentFolders"
        :current-files="currentFiles"
        :breadcrumb="breadcrumb"
        :is-content-loading="isContentLoading"
        :has-more="loadingMore || (currentFiles.length < (selectedFolder ? 999999 : 0))"
        :search-results="searchResults"
        @folder-click="onFolderClick"
        @breadcrumb-click="onBreadcrumbClick"
        @load-more="onLoadMoreFiles"
        @context-menu-action="onContextMenuAction"
        @search-page-change="onSearchPageChange"
        @search-type-change="onSearchTypeChange"
      />
    </div>

    <!-- Mobile Content Panel -->
    <div class="md:hidden flex-1 overflow-hidden min-h-0">
      <ContentPanel
        :is-searching="isSearching"
        :search-query="storeSearchQuery"
        :search-type="searchType"
        :search-folders="searchFolders"
        :search-files="searchFiles"
        :total-results="totalResults"
        :selected-folder="selectedFolder"
        :current-folders="currentFolders"
        :current-files="currentFiles"
        :breadcrumb="breadcrumb"
        :is-content-loading="isContentLoading"
        :has-more="loadingMore || (currentFiles.length < (selectedFolder ? 999999 : 0))"
        :search-results="searchResults"
        @folder-click="onFolderClick"
        @breadcrumb-click="onBreadcrumbClick"
        @load-more="onLoadMoreFiles"
        @context-menu-action="onContextMenuAction"
        @search-page-change="onSearchPageChange"
        @search-type-change="onSearchTypeChange"
      />
    </div>

    <DetailsModal :show="showDetailsModal" :item="selectedItem" @close="showDetailsModal = false" />
  </div>
</template>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
</style>
