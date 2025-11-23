<script setup lang="ts">
import { computed } from 'vue';
import type { Folder } from '../../../domain/entities/folder.entity';

const props = defineProps<{
  folder: Folder;
  level: number;
  activeFolderId?: string;
  isLoading?: boolean;
  isExpanded?: boolean;
  hasChildren?: boolean;
}>();

const emit = defineEmits<{
  toggle: [folder: Folder];
  select: [folder: Folder];
}>();

// Style Indentasi
const indentStyle = computed(() => ({ paddingLeft: `${props.level * 20}px` }));
const isActive = computed(() => props.activeFolderId === props.folder.id);

const onSelect = () => {
  emit('select', props.folder);
};

const onToggle = (event: Event) => {
  event.stopPropagation();
  emit('toggle', props.folder);
};
</script>

<template>
  <div class="select-none text-gray-700">
    <div
      class="flex items-center py-2 px-2 hover:bg-blue-50 cursor-pointer transition-colors rounded-md group"
      :class="{ 'bg-blue-100 text-blue-800': isActive }"
      :style="indentStyle"
      @click="onSelect"
    >
      <button
        v-if="hasChildren"
        @click="onToggle"
        class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-black mr-2 rounded hover:bg-gray-100 transition-colors"
      >
        <span v-if="isLoading" class="animate-spin text-sm">↻</span>
        <span v-else-if="isExpanded" class="text-xs">▼</span>
        <span v-else class="text-xs">▶</span>
      </button>
      <div v-else class="w-6 h-6 mr-2"></div>

      <span class="mr-3 text-lg group-hover:scale-110 transition-transform">📁</span>
      <span class="truncate font-medium text-sm group-hover:text-blue-700 transition-colors">{{ folder.name || 'Root' }}</span>
    </div>

    <!-- Child folders (expanded state) -->
    <div v-if="isExpanded && $slots.children">
      <slot name="children"></slot>
    </div>
  </div>
</template>