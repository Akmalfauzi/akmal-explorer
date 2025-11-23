<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { File } from '../../../domain/entities/file.entity';
import type { Folder } from '../../../domain/entities/folder.entity';
import type { SearchResult } from '../../../domain/entities/search.entity';
import SearchBreadcrumb from './SearchBreadcrumb.vue';
import SearchFolderGrid from './SearchFolderGrid.vue';
import SearchFileGrid from './SearchFileGrid.vue';
import { Pagination } from '../../ui/pagination';
import { formatNumber } from '@/infrastructure/utils/number-utils';

const props = defineProps<{
  searchResponse: SearchResult | null;
  isLoading: boolean;
  searchType: 'folder' | 'file';
}>();

const emit = defineEmits<{
  folderClick: [folder: Folder];
  contextMenuAction: [{ action: string; item: File | Folder; type: 'file' | 'folder' }];
  pageChange: [page: number, query: string];
}>();

const totalResults = computed(() => {
  if (!props.searchResponse) return 0;
  return props.searchResponse.result?.meta?.total || 0;
});

const currentPage = ref(1);
const totalPages = computed(() => {
  if (!props.searchResponse) return 1;
  return props.searchResponse.result?.meta?.totalPages || 1;
});

const displayedCount = computed(() => {
  if (!props.searchResponse) return 0;
  return props.searchResponse.result?.data?.length || 0;
});

const searchQuery = computed(() => props.searchResponse?.query || '');

// Reset pagination when search query changes
watch(() => props.searchResponse?.query, () => {
  currentPage.value = 1;
});

// Sync currentPage with search type
watch(() => props.searchType, () => {
  // Reset to page 1 when changing type
  currentPage.value = 1;
});

const onPageChange = (page: number) => {
  currentPage.value = page;
  emit('pageChange', page, searchQuery.value);
};

const shouldShowFolders = computed(() => {
  return props.searchType === 'folder';
});

const shouldShowFiles = computed(() => {
  return props.searchType === 'file';
});

const folders = computed(() => {
  if (!props.searchResponse || props.searchResponse.type !== 'folder') return [];
  return props.searchResponse.result?.data as Folder[] || [];
});

const files = computed((): File[] => {
  if (!props.searchResponse || props.searchResponse.type !== 'file') return [];
  return (props.searchResponse.result?.data as unknown as File[]) || [];
});
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Search Breadcrumb -->
    <SearchBreadcrumb
      v-if="searchResponse?.query"
      :query="searchResponse.query"
      :total-results="totalResults"
    />

    <!-- Content Area -->
    <div class="flex-1 overflow-y-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center h-64">
        <div class="flex items-center space-x-3 text-gray-600">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Mencari...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!searchResponse || totalResults === 0" class="flex flex-col items-center justify-center h-64 text-gray-400">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-lg font-medium mb-2">Tidak ada hasil</h3>
        <p class="text-sm text-gray-500">Coba sesuaikan kata kunci pencarian</p>
      </div>

      <!-- Search Results -->
      <div v-else class="pb-4">
        <!-- Folders Section -->
        <SearchFolderGrid
          v-if="shouldShowFolders && folders.length > 0"
          :folders="folders"
          :is-loading="false"
          @folder-click="$emit('folderClick', $event)"
          @context-menu-action="$emit('contextMenuAction', $event)"
        />

        <!-- Files Section -->
        <SearchFileGrid
          v-if="shouldShowFiles && files.length > 0"
          :files="files"
          :is-loading="false"
          @context-menu-action="$emit('contextMenuAction', $event)"
        />

        <!-- Results Summary & Pagination -->
        <div v-if="totalPages > 1" class="px-3 sm:px-4 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              Menampilkan {{ formatNumber(displayedCount) }} dari {{ formatNumber(totalResults) }} hasil
            </div>
            <div class="flex justify-center sm:justify-end">
              <Pagination
                :current-page="currentPage"
                :total-pages="totalPages"
                @page-change="onPageChange"
              />
            </div>
          </div>
        </div>
        <div v-else class="px-3 sm:px-4 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
          <div class="text-xs sm:text-sm text-gray-600 text-center">
            Menampilkan {{ formatNumber(displayedCount) }} hasil
          </div>
        </div>
      </div>
    </div>
  </div>
</template>