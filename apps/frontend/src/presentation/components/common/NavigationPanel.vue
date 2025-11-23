<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Folder } from '@/domain/entities/folder.entity';
import FolderNode from '@/presentation/components/explorer/FolderNode.vue';

const props = defineProps<{
  rootFolders: Folder[];
  selectedFolder: Folder | null;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  expandedFolders?: Set<string>;
  loadingFolders?: Set<string>;
  folderChildren?: Map<string, Folder[]>;
}>();

const emit = defineEmits<{
  homeClick: [];
  folderSelect: [folder: Folder];
  folderToggle: [folder: Folder];
  loadChildren: [folderId: string];
  loadMore: [];
}>();

// Use shared state if provided, otherwise use local state
const expandedFolders = computed(() => props.expandedFolders || new Set());
const loadingFolders = computed(() => props.loadingFolders || new Set());
const folderChildren = computed(() => props.folderChildren || new Map());
const scrollContainer = ref<HTMLElement | null>(null);

const toggleFolder = (folder: Folder) => {
  emit('folderToggle', folder);
};

const onFolderSelect = (folder: Folder) => {
  emit('folderSelect', folder);
};

const setFolderChildren = (folderId: string, children: Folder[]) => {
  // This method is called from parent, but since we're using computed properties,
  // the actual state is managed by the parent
  // This method is kept for backward compatibility but doesn't need to do anything
  // since the parent manages the state
};

// Infinite scroll handler
const handleScroll = () => {
  if (!scrollContainer.value) return;
  
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value;
  const threshold = 100; // pixels from bottom
  
  if (scrollHeight - scrollTop - clientHeight < threshold) {
    emit('loadMore');
  }
};

onMounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll);
  }
});

defineExpose({
  setFolderChildren
});
</script>

<template>
  <div
    ref="scrollContainer"
    class="w-full md:w-1/4 min-w-0 md:min-w-[260px] md:max-w-sm border-r border-gray-200 bg-gray-50 overflow-y-auto custom-scrollbar h-full min-h-0"
  >
    <div class="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 z-10">
      Navigasi
    </div>

    <div class="px-2 pb-10">
      <div
        class="mb-4 p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all shadow-sm hover:shadow-md group"
        :class="{ 'bg-blue-50 border-blue-400': !selectedFolder }"
        @click="emit('homeClick')"
      >
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-linear-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center text-lg group-hover:from-blue-200 group-hover:to-blue-100">
            🏠
          </div>
          <div class="flex-1">
            <div class="font-medium text-gray-800 group-hover:text-blue-700">Beranda</div>
            <div class="text-xs text-gray-500 group-hover:text-blue-600">Direktori Utama</div>
          </div>
        </div>
      </div>

      <div class="space-y-1">
        <FolderNode
          v-for="folder in rootFolders"
          :key="folder.id"
          :folder="folder"
          :level="0"
          :active-folder-id="selectedFolder?.id"
          :is-expanded="expandedFolders.has(folder.id)"
          :is-loading="loadingFolders.has(folder.id)"
          :has-children="true"
          @toggle="toggleFolder"
          @select="onFolderSelect"
        >
          <template #children>
            <FolderNode
              v-for="child in folderChildren.get(folder.id) || []"
              :key="child.id"
              :folder="child"
              :level="1"
              :active-folder-id="selectedFolder?.id"
              :is-expanded="expandedFolders.has(child.id)"
              :is-loading="loadingFolders.has(child.id)"
              :has-children="true"
              @toggle="toggleFolder"
              @select="onFolderSelect"
            >
              <template #children>
                <FolderNode
                  v-for="grandChild in folderChildren.get(child.id) || []"
                  :key="grandChild.id"
                  :folder="grandChild"
                  :level="2"
                  :active-folder-id="selectedFolder?.id"
                  :is-expanded="expandedFolders.has(grandChild.id)"
                  :is-loading="loadingFolders.has(grandChild.id)"
                  :has-children="true"
                  @toggle="toggleFolder"
                  @select="onFolderSelect"
                />
              </template>
            </FolderNode>
          </template>
        </FolderNode>
      </div>

      <!-- Loading More Indicator -->
      <div v-if="isLoadingMore" class="mt-2 space-y-2">
        <!-- Skeleton loaders -->
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="flex items-center space-x-2 p-2 rounded-lg bg-gray-200">
            <div class="w-5 h-5 bg-gray-300 rounded"></div>
            <div class="flex-1 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
        <div class="py-2 text-center">
          <div class="flex items-center justify-center space-x-2 text-gray-500">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span class="text-xs font-medium">Memuat folder...</span>
          </div>
        </div>
      </div>

      <!-- End of List Indicator -->
      <div v-else-if="!hasMore && rootFolders.length > 0" class="py-4 text-center">
        <span class="text-xs text-gray-400">✓ Semua folder telah dimuat</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
