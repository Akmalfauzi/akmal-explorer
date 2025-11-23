<script setup lang="ts">
import { computed } from 'vue';
import { formatFileSize } from '@/infrastructure/utils/number-utils';
import { resolveFileExtension } from '@/infrastructure/utils/file-utils';

const props = defineProps<{
  item: any;
  show: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const isFile = computed(() => props.item && 'mimeType' in props.item);
const fileExtension = computed(() => {
  if (!isFile.value || !props.item) return '';
  return resolveFileExtension(props.item.name, props.item.mimeType);
});
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
    @click="emit('close')"
  >
    <div
      class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col mx-4"
      @click.stop
    >
      <div class="flex items-center justify-between p-4">
        <h3 class="text-lg font-semibold text-gray-900">📋 Details</h3>
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="item">
          <div class="flex items-center mb-6">
            <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl mr-4">
              {{ isFile ? '📄' : '📁' }}
            </div>
            <div>
              <h4 class="text-xl font-medium text-gray-900">
                {{ item.name || 'Untitled' }}
              </h4>
              <p class="text-sm text-gray-500">
                {{ isFile ? 'File' : 'Folder' }}
              </p>
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <span class="text-sm font-medium text-gray-600 block mb-1">NAME</span>
              <span class="text-base font-bold text-gray-900 break-all">{{ item.name || 'Untitled' }}</span>
            </div>

            <div>
              <span class="text-sm font-medium text-gray-600 block mb-1">TYPE</span>
              <span class="text-base font-bold text-gray-900">{{ isFile ? 'File' : 'Folder' }}</span>
            </div>

            <div v-if="item.size !== undefined">
              <span class="text-sm font-medium text-gray-600 block mb-1">SIZE</span>
              <span class="text-base font-bold text-gray-900">{{ formatFileSize(item.size) }}</span>
            </div>

            <div v-if="isFile">
              <span class="text-sm font-medium text-gray-600 block mb-1">EXTENSION</span>
              <span class="text-base font-bold text-gray-900">{{ fileExtension.toUpperCase() }}</span>
            </div>

            <div>
              <span class="text-sm font-medium text-gray-600 block mb-1">ID</span>
              <span class="text-base font-bold text-gray-900 break-all">{{ item.id }}</span>
            </div>

            <div>
              <span class="text-sm font-medium text-gray-600 block mb-1">CREATED</span>
              <span class="text-base font-bold text-gray-900">{{ item.createdAt ? new Date(item.createdAt).toLocaleString() : '—' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end p-4 bg-gray-50">
        <button
          @click="emit('close')"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
