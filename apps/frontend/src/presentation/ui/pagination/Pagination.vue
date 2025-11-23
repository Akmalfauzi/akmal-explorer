<script setup lang="ts">
import { computed } from 'vue';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next';
import Button from '../button/Button.vue';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
  showEdges?: boolean;
}

const props = withDefaults(defineProps<PaginationProps>(), {
  siblingCount: 1,
  showEdges: true,
});

const emit = defineEmits<{
  pageChange: [page: number];
}>();

const paginationRange = computed(() => {
  const delta = props.siblingCount + 2; // 2 for first and last page

  const range: number[] = [];
  const rangeWithDots: (number | string)[] = [];
  let l: number | undefined;

  for (let i = 1; i <= props.totalPages; i++) {
    if (i === 1 || i === props.totalPages || (i >= props.currentPage - delta && i <= props.currentPage + delta)) {
      range.push(i);
    }
  }

  range.forEach((i) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  });

  return rangeWithDots;
});

const isFirstPage = computed(() => props.currentPage === 1);
const isLastPage = computed(() => props.currentPage === props.totalPages);

const onPageChange = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('pageChange', page);
  }
};
</script>

<template>
  <div class="flex items-center justify-center space-x-1 flex-wrap gap-1">
    <!-- First page -->
    <Button
      variant="outline"
      size="sm"
      :disabled="isFirstPage"
      @click="onPageChange(1)"
      class="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
    >
      <ChevronsLeft class="h-3 w-3 sm:h-4 sm:w-4" />
    </Button>

    <!-- Previous page -->
    <Button
      variant="outline"
      size="sm"
      :disabled="isFirstPage"
      @click="onPageChange(currentPage - 1)"
      class="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
    >
      <ChevronLeft class="h-3 w-3 sm:h-4 sm:w-4" />
    </Button>

    <!-- Page numbers -->
    <div class="flex items-center space-x-1 flex-wrap gap-1">
      <Button
        v-for="page in paginationRange"
        :key="page"
        :variant="page === currentPage ? 'default' : 'outline'"
        size="sm"
        :disabled="page === '...'"
        @click="typeof page === 'number' ? onPageChange(page) : null"
        :class="[
          'h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0 text-xs sm:text-sm',
          page === '...' && 'cursor-default text-muted-foreground'
        ]"
      >
        {{ page }}
      </Button>
    </div>

    <!-- Next page -->
    <Button
      variant="outline"
      size="sm"
      :disabled="isLastPage"
      @click="onPageChange(currentPage + 1)"
      class="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
    >
      <ChevronRight class="h-3 w-3 sm:h-4 sm:w-4" />
    </Button>

    <!-- Last page -->
    <Button
      variant="outline"
      size="sm"
      :disabled="isLastPage"
      @click="onPageChange(totalPages)"
      class="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
    >
      <ChevronsRight class="h-3 w-3 sm:h-4 sm:w-4" />
    </Button>
  </div>
</template>