<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { File } from '../../../domain/entities/file.entity';
import { formatNumber } from '@/infrastructure/utils/number-utils';
import { resolveFileExtension } from '@/infrastructure/utils/file-utils';
import { getFileIcon, formatFileSize } from '@/infrastructure/utils/file-helpers';

defineProps<{
  files: File[];
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  contextMenuAction: [{ action: string; item: File; type: 'file' }];
}>();

const contextMenu = ref<{
  visible: boolean;
  x: number;
  y: number;
  item: File | null;
}>({
  visible: false,
  x: 0,
  y: 0,
  item: null
});

// Modal state for details
const showDetailsModal = ref(false);
const selectedItem = ref<File | null>(null);
const isDetailsLoading = ref(false);

const onFileRightClick = (event: MouseEvent, file: File) => {
  event.preventDefault();
  event.stopPropagation();

  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    item: file
  };
};

const onContextMenuAction = (action: string) => {
  const item = contextMenu.value.item;
  if (!item) return;

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
    emit('contextMenuAction', { action, item, type: 'file' });
  }

  contextMenu.value.visible = false;
};

// Click outside handler to close context menu
const handleClickOutside = () => {
  contextMenu.value.visible = false;
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Helper functions

const formatDate = (date?: Date | string): string => {
  if (!date) return '—';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString();
};
</script>

<template>
  <div v-if="files.length > 0">
    <div class="px-4 py-2 bg-gray-100 border-b">
      <h3 class="text-sm font-semibold text-gray-600">📄 FILE ({{ formatNumber(files.length) }})</h3>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
      <div
        v-for="file in files"
        :key="file.id"
        class="group flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 border border-gray-200 hover:border-blue-300 cursor-pointer transition-all shadow-sm hover:shadow-md"
        @contextmenu="onFileRightClick($event, file)"
      >
        <div class="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-3xl mb-2 text-gray-500 group-hover:bg-white">
          {{ getFileIcon(resolveFileExtension(file.name, file.mimeType)) }}
        </div>

        <span class="text-sm text-center text-gray-700 font-medium truncate w-full px-1">
          {{ file.name }}
        </span>
        <span class="text-xs text-gray-400 mt-1">
          {{ formatFileSize(file.size) }}
        </span>
      </div>
    </div>
  </div>

  <!-- Empty state -->
  <div v-else-if="!isLoading">
    <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
      <h3 class="text-sm font-semibold text-gray-600 flex items-center">
        📄 FILE (0)
      </h3>
    </div>
    <div class="flex flex-col items-center justify-center py-8 text-gray-400">
      <div class="text-4xl mb-2">📄</div>
      <p class="text-sm">Tidak ada file ditemukan</p>
    </div>
  </div>

  <!-- Context Menu -->
  <div
    v-if="contextMenu.visible"
    class="fixed z-50 min-w-[200px] rounded-md border bg-popover p-1 text-popover-foreground shadow-lg"
    :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
  >
    <div class="px-2 py-1.5 text-sm font-semibold border-b">
      📄 File
    </div>

    <button
      disabled
      class="relative flex w-full cursor-not-allowed select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-gray-400"
    >
      ⬇️ Unduh
    </button>

    <button
      @click="onContextMenuAction('details')"
      class="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
    >
      📋 Detail
    </button>

    <div class="border-t my-1"></div>

    <button
      disabled
      class="relative flex w-full cursor-not-allowed select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-gray-400"
    >
      🗑️ Hapus
    </button>
  </div>

  <!-- Details Modal -->
  <div
    v-if="showDetailsModal"
    class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
    @click="showDetailsModal = false"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col mx-4"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-4">
        <h3 class="text-lg font-semibold text-gray-900">
          📋 Detail File
        </h3>
        <button
          @click="showDetailsModal = false"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="flex-1 overflow-y-auto p-6">
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
            <div class="flex justify-between py-2">
              <div class="h-4 bg-gray-200 rounded w-24"></div>
              <div class="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>

        <!-- Actual Content -->
        <div v-else-if="selectedItem">
          <!-- Icon and Name -->
          <div class="flex items-center mb-6">
            <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl mr-4">
              {{ getFileIcon(resolveFileExtension(selectedItem.name, selectedItem.mimeType)) }}
            </div>
            <div>
              <h4 class="text-xl font-medium text-gray-900">
                {{ selectedItem.name }}
              </h4>
              <p class="text-sm text-gray-500">
                File
              </p>
            </div>
          </div>

          <!-- Details Table -->
          <div class="space-y-6">
            <div>
              <span class="text-sm font-medium text-gray-600 block mb-1">NAMA</span>
              <span class="text-base font-semibold text-gray-900 break-all">{{ selectedItem.name }}</span>
            </div>

            <div>
              <span class="text-sm font-medium text-gray-600 block mb-1">TIPE</span>
              <span class="text-base font-semibold text-gray-900">File</span>
            </div>

            <div>
              <span class="text-sm font-medium text-gray-600 block mb-1">UKURAN</span>
              <span class="text-base font-semibold text-gray-900">{{ formatFileSize(selectedItem.size) }}</span>
            </div>

            <div>
              <span class="text-sm font-medium text-gray-600 block mb-1">EKSTENSI</span>
              <span class="text-base font-semibold text-gray-900">{{ resolveFileExtension(selectedItem.name, selectedItem.mimeType).toUpperCase() }}</span>
            </div>

            <div>
              <span class="text-sm font-medium text-gray-600 block mb-1">TIPE MIME</span>
              <span class="text-base font-semibold text-gray-900 break-all">{{ selectedItem.mimeType }}</span>
            </div>

            <div>
              <span class="text-sm font-medium text-gray-600 block mb-1">ID FOLDER</span>
              <span class="text-base font-semibold text-gray-900 break-all">{{ selectedItem.folderId }}</span>
            </div>

            <div>
              <span class="text-sm font-medium text-gray-600 block mb-1">DIBUAT</span>
              <span class="text-base font-semibold text-gray-900">{{ formatDate(selectedItem.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end p-4 bg-gray-50">
        <button
          @click="showDetailsModal = false"
          :disabled="isDetailsLoading"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {{ isDetailsLoading ? 'Memuat...' : 'Tutup' }}
        </button>
      </div>
    </div>
  </div>
</template>