<script setup lang="ts">

import { ref, onMounted, onUnmounted } from 'vue';
import type { File } from '../../../domain/entities/file.entity';
import type { Folder } from '../../../domain/entities/folder.entity';
import { formatNumber } from '@/infrastructure/utils/number-utils';
import { resolveFileExtension } from '@/infrastructure/utils/file-utils';
import { getFileIcon, formatFileSize } from '@/infrastructure/utils/file-helpers';

const props = defineProps<{
  folders: Folder[];
  files: File[];
  isLoading: boolean;
  hasMore: boolean;
  breadcrumb?: Folder[];
}>();

const emit = defineEmits([
  'loadMore',
  'folderClick',
  'fileRightClick',
  'folderRightClick',
  'contextMenuAction',
  'breadcrumbClick'
]);
const scrollTrigger = ref<HTMLElement | null>(null);

// Context menu state
const contextMenu = ref<{
  visible: boolean;
  x: number;
  y: number;
  item: File | Folder | null;
  type: 'file' | 'folder' | null;
}>({
  visible: false,
  x: 0,
  y: 0,
  item: null,
  type: null
});

// Modal state
const showDetailsModal = ref(false);
const selectedItem = ref<File | Folder | null>(null);
const isDetailsLoading = ref(false);

// Click outside handler to close context menu
const handleClickOutside = () => {
  contextMenu.value.visible = false;
};

// Event handlers
const onFolderClick = (folder: Folder) => {
  emit('folderClick', folder);
};

const onFolderRightClick = (event: MouseEvent, folder: Folder) => {
  event.preventDefault();
  event.stopPropagation();

  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    item: folder,
    type: 'folder'
  };

  emit('folderRightClick', { event, folder });
};

const onFileRightClick = (event: MouseEvent, file: File) => {
  event.preventDefault();
  event.stopPropagation();

  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    item: file,
    type: 'file'
  };

  emit('fileRightClick', { event, file });
};

const onContextMenuAction = (action: string) => {
  const item = contextMenu.value.item;
  const type = contextMenu.value.type;

  if (!item || !type) return;

  if (action === 'details') {
    // Show modal immediately with skeleton
    showDetailsModal.value = true;
    isDetailsLoading.value = true;
    selectedItem.value = null;

    // Simulate loading delay for demo purposes
    setTimeout(() => {
      selectedItem.value = item;
      isDetailsLoading.value = false;
    }, 800);
  } else {
    // Emit action to parent for other actions
    emit('contextMenuAction', { action, item, type });
  }

  contextMenu.value.visible = false;
};

// Setup Intersection Observer untuk Infinite Scroll
let observer: IntersectionObserver | null = null;

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    // Jika elemen trigger terlihat DAN tidak sedang loading DAN masih ada data
    if (entries[0]?.isIntersecting && !props.isLoading && props.hasMore) {
      emit('loadMore');
    }
  }, { threshold: 0.5 });

  if (scrollTrigger.value) observer.observe(scrollTrigger.value);

  // Add click outside listener for context menu
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  if (observer) observer.disconnect();
  document.removeEventListener('click', handleClickOutside);
});

// Helper functions

// Modal helper functions
const isFile = (item: File | Folder): item is File => {
  return 'mimeType' in item;
};

const getSelectedItemIcon = (): string => {
  if (!selectedItem.value) return '📄';
  if (isFile(selectedItem.value)) {
    const file = selectedItem.value as File;
    const ext = resolveFileExtension(file.name, file.mimeType);
    return getFileIcon(ext);
  }
  return '📁';
};

const getSelectedItemName = (): string => {
  if (!selectedItem.value) return '';
  return selectedItem.value.name || 'Tanpa Nama';
};

const getSelectedItemType = (): string => {
  if (!selectedItem.value) return '';
  return isFile(selectedItem.value) ? 'File' : 'Folder';
};

const getSelectedItemSize = (): string => {
  if (!selectedItem.value) return '';
  return isFile(selectedItem.value) ? formatFileSize((selectedItem.value as File).size) : '—';
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString();
};
</script>

<template>
  <div class="h-full relative">
    <!-- Breadcrumb Navigation -->
    <div v-if="breadcrumb && breadcrumb.length > 0" class="px-3 sm:px-4 py-2 bg-white border-b border-gray-200 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm overflow-x-auto">
      <button
        v-for="(crumb, index) in breadcrumb"
        :key="crumb.id"
        @click="$emit('breadcrumbClick', crumb, index)"
        class="flex items-center hover:text-blue-600 transition-colors whitespace-nowrap flex-shrink-0"
      >
        <span class="text-gray-600">{{ crumb.name || 'Root' }}</span>
        <span v-if="index < breadcrumb.length - 1" class="mx-1 sm:mx-2 text-gray-400">›</span>
      </button>
    </div>

    <div v-if="!isLoading && folders.length === 0 && files.length === 0" class="flex flex-col items-center justify-center h-64 text-gray-400">
      <span class="text-4xl mb-2">📂</span>
      <p>Folder ini kosong</p>
    </div>

    <!-- Folders Section -->
    <div v-if="folders.length > 0" class="mb-6">
      <div class="px-4 py-2 bg-gray-100 border-b">
        <h3 class="text-sm font-semibold text-gray-600">📁 FOLDER ({{ formatNumber(folders.length) }})</h3>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 p-3 sm:p-4">
        <div
          v-for="folder in folders"
          :key="folder.id"
          class="group flex flex-col items-center p-2 sm:p-3 rounded-lg hover:bg-blue-50 border border-gray-200 hover:border-blue-300 cursor-pointer transition-all shadow-sm hover:shadow-md"
          @click="onFolderClick(folder)"
          @contextmenu="onFolderRightClick($event, folder)"
        >
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 rounded flex items-center justify-center text-2xl sm:text-3xl mb-2 text-blue-500 group-hover:bg-blue-100">
            📁
          </div>

          <span class="text-xs sm:text-sm text-center text-gray-700 font-medium truncate w-full px-1">
            {{ folder.name || 'Folder Tanpa Nama' }}
          </span>
          <span class="text-xs text-gray-400 mt-1">
            Folder
          </span>
        </div>
      </div>
    </div>

    <!-- Files Section -->
    <div v-if="files.length > 0">
      <div class="px-3 sm:px-4 py-2 bg-gray-100 border-b">
        <h3 class="text-sm font-semibold text-gray-600">📄 FILE ({{ formatNumber(files.length) }})</h3>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 p-3 sm:p-4">
        <div
          v-for="file in files"
          :key="file.id"
          class="group flex flex-col items-center p-2 sm:p-3 rounded-lg hover:bg-blue-50 border border-gray-200 hover:border-blue-300 cursor-pointer transition-all shadow-sm hover:shadow-md"
          @contextmenu="onFileRightClick($event, file)"
        >
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded flex items-center justify-center text-2xl sm:text-3xl mb-2 text-gray-500 group-hover:bg-white">
            {{ getFileIcon(resolveFileExtension(file.name, file.mimeType)) }}
          </div>

          <span class="text-xs sm:text-sm text-center text-gray-700 font-medium truncate w-full px-1">
            {{ file.name }}
          </span>
          <span class="text-xs text-gray-400 mt-1">
            {{ formatFileSize(file.size) }}
          </span>
        </div>
      </div>
    </div>

    <div ref="scrollTrigger" class="py-4 text-center text-gray-400 text-sm h-10">
      <span v-if="isLoading">Memuat lebih banyak file...</span>
    </div>

    <!-- Context Menu (shadcn-style) -->
    <div
      v-if="contextMenu.visible"
      class="fixed z-50 min-w-[200px] rounded-md border bg-popover p-1 text-popover-foreground shadow-lg"
      :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
    >
      <div class="px-2 py-1.5 text-sm font-semibold border-b">
        {{ contextMenu.type === 'folder' ? '📁 Folder' : '📄 File' }}
      </div>

      <!-- File-specific actions (disabled) -->
      <button
        v-if="contextMenu.type === 'file'"
        disabled
        class="relative flex w-full cursor-not-allowed select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-gray-400"
      >
        ⬇️ Unduh
      </button>

      <button
        disabled
        class="relative flex w-full cursor-not-allowed select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-gray-400"
      >
        🗑️ Hapus
      </button>

      <div class="border-t my-1"></div>

      <!-- Enabled action -->
      <button
        @click="onContextMenuAction('details')"
        class="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
      >
        📋 Detail
      </button>
    </div>

    <!-- Details Modal -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-2 sm:p-4"
      @click="showDetailsModal = false"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col mx-2 sm:mx-4"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-3 sm:p-4 border-b">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900">
            📋 Detail Item
          </h3>
          <button
            @click="showDetailsModal = false"
            class="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6">
          <!-- Loading Skeleton -->
          <div v-if="isDetailsLoading" class="animate-pulse">
            <!-- Icon and Name Skeleton -->
            <div class="flex items-center mb-6">
              <div class="w-16 h-16 bg-gray-200 rounded-lg mr-4"></div>
              <div class="flex-1">
                <div class="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>

            <!-- Details Table Skeleton -->
            <div class="space-y-4">
              <div class="flex justify-between py-2 border-b">
                <div class="h-4 bg-gray-200 rounded w-20"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div class="flex justify-between py-2 border-b">
                <div class="h-4 bg-gray-200 rounded w-16"></div>
                <div class="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div class="flex justify-between py-2 border-b">
                <div class="h-4 bg-gray-200 rounded w-12"></div>
                <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div class="flex justify-between py-2 border-b">
                <div class="h-4 bg-gray-200 rounded w-20"></div>
                <div class="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div class="flex justify-between py-2 border-b">
                <div class="h-4 bg-gray-200 rounded w-24"></div>
                <div class="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div class="flex justify-between py-2 border-b">
                <div class="h-4 bg-gray-200 rounded w-16"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div class="flex justify-between py-2">
                <div class="h-4 bg-gray-200 rounded w-20"></div>
                <div class="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>

          <!-- Actual Content -->
          <div v-else-if="selectedItem">
            <!-- Icon and Name -->
            <div class="flex items-center mb-6">
              <div class="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center text-3xl mr-4">
                {{ getSelectedItemIcon() }}
              </div>
              <div>
                <h4 class="text-xl font-medium text-gray-900">
                  {{ getSelectedItemName() }}
                </h4>
                <p class="text-sm text-gray-500">
                  {{ getSelectedItemType() }}
                </p>
              </div>
            </div>

            <!-- Details Table -->
            <div class="space-y-6">
              <div>
                <span class="text-sm font-medium text-gray-600 block mb-1">NAMA</span>
                <span class="text-base font-semibold text-gray-900 break-all">{{ getSelectedItemName() }}</span>
              </div>

              <div>
                <span class="text-sm font-medium text-gray-600 block mb-1">TIPE</span>
                <span class="text-base font-semibold text-gray-900">{{ getSelectedItemType() }}</span>
              </div>

              <div>
                <span class="text-sm font-medium text-gray-600 block mb-1">UKURAN</span>
                <span class="text-base font-semibold text-gray-900">{{ getSelectedItemSize() }}</span>
              </div>

              <div v-if="isFile(selectedItem)">
                <span class="text-sm font-medium text-gray-600 block mb-1">EKSTENSI</span>
                <span class="text-base font-semibold text-gray-900">{{ resolveFileExtension((selectedItem as File).name, (selectedItem as File).mimeType).toUpperCase() }}</span>
              </div>

              <div v-if="isFile(selectedItem)">
                <span class="text-sm font-medium text-gray-600 block mb-1">TIPE MIME</span>
                <span class="text-base font-semibold text-gray-900 break-all">{{ (selectedItem as File).mimeType }}</span>
              </div>

              <div v-if="!isFile(selectedItem) && breadcrumb && breadcrumb.length > 0">
                <span class="text-sm font-medium text-gray-600 block mb-1">PATH</span>
                <span class="text-base font-semibold text-gray-900 break-all">
                  {{ breadcrumb.map(b => b.name || 'Root').join(' / ') }}
                </span>
              </div>

              <div>
                <span class="text-sm font-medium text-gray-600 block mb-1">DIBUAT</span>
                <span class="text-base font-semibold text-gray-900">{{ formatDate(selectedItem.createdAt?.toString()) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end p-3 sm:p-4 bg-gray-50 border-t">
          <button
            @click="showDetailsModal = false"
            :disabled="isDetailsLoading"
            class="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {{ isDetailsLoading ? 'Memuat...' : 'Tutup' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Skeleton Loading -->
    <div v-if="isLoading && folders.length === 0 && files.length === 0" class="px-3 sm:px-4 py-4 sm:py-6">
      <!-- Folder Skeletons -->
      <div class="mb-6">
        <div class="h-6 bg-gray-200 rounded w-24 sm:w-32 mb-4"></div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          <div v-for="i in 6" :key="`folder-skeleton-${i}`" class="animate-pulse">
            <div class="bg-gray-200 rounded-lg p-2 sm:p-3 border border-gray-300 shadow-sm">
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 rounded mb-2 mx-auto"></div>
              <div class="h-3 sm:h-4 bg-gray-300 rounded w-full mb-1"></div>
              <div class="h-3 bg-gray-300 rounded w-10 sm:w-12 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- File Skeletons -->
      <div>
        <div class="h-6 bg-gray-200 rounded w-24 sm:w-32 mb-4"></div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          <div v-for="i in 8" :key="`file-skeleton-${i}`" class="animate-pulse">
            <div class="bg-gray-200 rounded-lg p-2 sm:p-3 border border-gray-300 shadow-sm">
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 rounded mb-2 mx-auto"></div>
              <div class="h-3 sm:h-4 bg-gray-300 rounded w-full mb-1"></div>
              <div class="h-3 bg-gray-300 rounded w-12 sm:w-16 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay for Infinite Scroll -->
    <div v-if="isLoading && (folders.length > 0 || files.length > 0)" class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t p-2 z-40">
      <div class="flex items-center justify-center space-x-2">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span class="text-sm text-gray-600">Memuat lebih banyak item...</span>
      </div>
    </div>
  </div>
</template>