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
  <div class="min-h-screen flex flex-col selection:bg-brand-accent selection:text-brand-900">
    <AppHeader />
    <main class="grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div v-if="authStore.isLoading" class="flex flex-col items-center justify-center h-64 gap-4">
        <div
          class="w-8 h-8 border-4 border-brand-700 dark:border-brand-600 border-t-brand-accent dark:border-t-brand-accent rounded-full animate-spin"
        ></div>
        <p class="text-brand-600 dark:text-slate-300 text-lg font-medium animate-pulse">
          Loading application...
        </p>
      </div>
      <RouterView />
    </main>
  </div>
</template>
