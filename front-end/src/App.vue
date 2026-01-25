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
  <AppHeader />
  <div v-if="authStore.isLoading">Loading application...</div>
  <div></div>
  <RouterView />
</template>
