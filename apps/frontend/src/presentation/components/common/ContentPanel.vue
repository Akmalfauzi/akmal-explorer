<script setup lang="ts">
import type { Folder } from '@/domain/entities/folder.entity';
import type { File } from '@/domain/entities/file.entity';
import type { SearchResult } from '@/domain/entities/search.entity';
import { formatNumber } from '@/infrastructure/utils/number-utils';
import FileGrid from '@/presentation/components/explorer/FileGrid.vue';
import SearchResults from '@/presentation/components/search/SearchResults.vue';

defineProps<{
  isSearching: boolean;
  searchQuery: string;
  searchType: 'folder' | 'file';
  searchFolders: Folder[];
  searchFiles: File[];
  totalResults: number;
  selectedFolder: Folder | null;
  currentFolders: Folder[];
  currentFiles: File[];
  breadcrumb: Folder[];
  isContentLoading: boolean;
  hasMore: boolean;
  searchResults: SearchResult | null;
}>();

const emit = defineEmits<{
  folderClick: [folder: Folder];
  breadcrumbClick: [folder: Folder, index: number];
  loadMore: [];
  contextMenuAction: [{ action: string; item: any; type: 'file' | 'folder' }];
  searchPageChange: [page: number, query: string];
  searchTypeChange: [type: 'folder' | 'file'];
}>();
</script>

<template>
  <div class="flex-1 bg-white overflow-y-auto flex flex-col relative min-h-0">
    <div class="p-3 sm:p-4 border-b flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 sticky top-0 bg-white/90 backdrop-blur z-10">
      <h2 class="text-lg sm:text-xl font-semibold text-gray-800 truncate">
        <span v-if="searchQuery.trim()">🔍 Hasil Pencarian: "{{ searchQuery }}"</span>
        <span v-else>{{ selectedFolder ? (selectedFolder.name || 'Root') : 'Pilih folder' }}</span>
      </h2>
      <span class="text-xs sm:text-sm text-gray-500 flex-shrink-0">
        <span v-if="searchQuery.trim()">
          {{ formatNumber(searchFolders.length + searchFiles.length) }} dari {{ formatNumber(totalResults) }} hasil
        </span>
        <span v-else>
          {{ formatNumber(currentFolders.length + currentFiles.length) }} item ditampilkan
        </span>
      </span>
    </div>

    <div class="flex-1 overflow-y-auto">
      <SearchResults
        v-if="searchQuery.trim()"
        :search-response="searchResults"
        :search-type="searchType"
        :is-loading="isSearching"
        @folder-click="emit('folderClick', $event)"
        @context-menu-action="emit('contextMenuAction', $event)"
        @page-change="emit('searchPageChange', $event, searchQuery)"
        @type-change="emit('searchTypeChange', $event)"
      />

      <FileGrid
        v-else
        :folders="currentFolders"
        :files="currentFiles"
        :breadcrumb="breadcrumb"
        :is-loading="isContentLoading"
        :has-more="hasMore"
        @loadMore="emit('loadMore')"
        @folder-click="emit('folderClick', $event)"
        @breadcrumb-click="(folder, index) => emit('breadcrumbClick', folder, index)"
        @context-menu-action="emit('contextMenuAction', $event)"
      />
    </div>
  </div>
</template>
