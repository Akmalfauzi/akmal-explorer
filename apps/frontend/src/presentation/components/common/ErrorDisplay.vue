<script setup lang="ts">
defineProps<{
  message: string;
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <div class="bg-red-50 border-b border-red-200 p-3">
    <div class="flex items-center">
      <span class="text-red-500 mr-2">⚠️</span>
      <span class="text-red-700 text-sm">{{ message }}</span>
      <button @click="emit('close')" class="ml-auto text-red-500 hover:text-red-700">✕</button>
    </div>
  </div>
</template>
