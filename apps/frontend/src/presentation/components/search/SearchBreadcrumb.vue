<script setup lang="ts">
import { formatNumber } from '@/infrastructure/utils/number-utils';

defineProps<{
  query: string;
  totalResults: number;
}>();
</script>

<template>
  <div class="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
    <div class="flex items-center space-x-2 text-sm">
      <span class="text-blue-600">🔍</span>
      <span class="text-gray-700">Hasil Pencarian untuk</span>
      <span class="font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">"{{ query }}"</span>
      <span class="text-gray-500">({{ formatNumber(totalResults) }} hasil)</span>
    </div>
  </div>
</template>