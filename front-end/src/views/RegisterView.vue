<script setup lang="js">
import RegisterForm from '@/components/RegisterForm.vue'
import router from '@/router'
import { useAuthstore } from '@/stores/authStore'

async function submit(credentials) {
  const auth = await authStore.register(credentials)
  if (auth) {
    router.push({ path: '/' })
  }
}

const authStore = useAuthstore()
</script>

<template>
  <main>
    <h1>Welcome ! Please Register</h1>
    <p class="error">{{ authStore.error }}</p>
    <RegisterForm :is-loading="authStore.isLoading" @submit="submit" />
  </main>
</template>
