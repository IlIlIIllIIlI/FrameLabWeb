<script setup>
import { RouterView } from 'vue-router'

import { onMounted } from 'vue'
import { useAuthstore } from '@/stores/authStore'
import AppHeader from './components/AppHeader.vue'

const authStore = useAuthstore()

onMounted(() => {
  authStore.checkUser()
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div
        v-if="authStore.isAppLoading"
        class="flex flex-col items-center justify-center h-64 gap-4"
      >
        <div
          class="w-8 h-8 border-4 border-nord-4 dark:border-nord-3 border-t-nord-8 dark:border-t-nord-8 rounded-full animate-spin"
        ></div>

        <p class="text-nord-3 dark:text-nord-4 text-lg font-medium animate-pulse">
          Loading application...
        </p>
      </div>
      <RouterView v-else />
    </main>
  </div>
</template>
