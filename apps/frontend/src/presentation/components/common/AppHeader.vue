<script setup lang="ts">

const searchQuery = defineModel<string>('searchQuery', { default: '' });
const searchType = defineModel<'folder' | 'file'>('searchType', { default: 'folder' });

const clearSearch = () => {
  searchQuery.value = '';
  searchType.value = 'folder';
};
</script>

<template>
  <div class="h-auto md:h-14 bg-white border-b px-4 py-3 md:py-0 shadow-sm z-10">
    <!-- Header untuk Desktop -->
    <div class="hidden md:flex items-center justify-between h-full">
      <div class="font-bold text-lg text-blue-600">Akmal Explorer</div>

      <div class="flex items-center gap-3">
        <!-- Filter Tabs -->
        <div class="flex gap-2">
          <button
            @click="searchType = 'folder'"
            :class="[
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              searchType === 'folder'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
            ]"
          >
            📁 Folder
          </button>
          <button
            @click="searchType = 'file'"
            :class="[
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              searchType === 'file'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
            ]"
          >
            📄 File
          </button>
        </div>

        <!-- Search Input Desktop -->
        <div class="flex items-center gap-2">
          <div class="relative w-64 lg:w-80">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari ..."
              class="w-full border rounded-md py-1.5 px-4 pl-9 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 focus:bg-white transition-all"
            />
            <span class="absolute left-3 top-1 text-gray-400">🔍</span>
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-2 top-1.5 p-1 hover:bg-gray-200 rounded-full transition-colors"
              title="Hapus pencarian"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <!-- Clear/Reset Filter Button Desktop -->
          <button
            @click="clearSearch"
            class="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 transition-colors flex items-center gap-1.5"
            title="Reset filter dan pencarian"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
            </svg>
            <span class="hidden lg:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Header untuk Mobile -->
    <div class="md:hidden space-y-3">
      <!-- Judul dan Filter Tabs Mobile -->
      <div class="flex items-center justify-between">
        <div class="font-bold text-base text-blue-600">Akmal Explorer</div>

        <!-- Filter Tabs Mobile -->
        <div class="flex gap-1">
          <button
            @click="searchType = 'folder'"
            :class="[
              'px-2 py-1 rounded text-xs font-medium transition-colors',
              searchType === 'folder'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
            ]"
          >
            📁
          </button>
          <button
            @click="searchType = 'file'"
            :class="[
              'px-2 py-1 rounded text-xs font-medium transition-colors',
              searchType === 'file'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
            ]"
          >
            📄
          </button>
        </div>
      </div>

      <!-- Search Input Mobile -->
      <div class="flex items-center gap-2">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari folder atau file..."
            class="w-full border rounded-md py-2 px-4 pl-9 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 focus:bg-white transition-all"
          />
          <span class="absolute left-3 top-2 text-gray-400">🔍</span>
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-2 top-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
            title="Hapus pencarian"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Clear/Reset Filter Button Mobile -->
        <button
          @click="clearSearch"
          class="px-2 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 transition-colors"
          title="Reset filter dan pencarian"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
