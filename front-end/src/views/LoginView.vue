<script setup lang="js">
import LoginForm from '@/components/LoginForm.vue'
import router from '@/router'
import { useAuthstore } from '@/stores/authStore'

async function submit(credentials) {
  const auth = await authStore.login(credentials)
  if (auth) {
    router.push({ path: '/' })
  }
}

const authStore = useAuthstore()
</script>

<template>
  <main class="w-full max-w-md mx-auto mt-10 sm:mt-20 px-4">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-black text-nord-0 dark:text-nord-6 tracking-tight mb-2">
        Welcome Back
      </h1>
      <p class="text-nord-3 dark:text-nord-4">Please log in to continue to FrameLab.</p>
    </div>

    <div
      v-if="authStore.error"
      class="mb-6 p-4 rounded-lg bg-nord-11/10 border border-nord-11/30 flex items-start gap-3"
    >
      <p class="text-sm font-medium text-nord-11">{{ authStore.error }}</p>
    </div>

    <div
      class="bg-nord-5 dark:bg-nord-1 p-6 sm:p-8 rounded-2xl shadow-sm border border-nord-4 dark:border-nord-2 transition-colors duration-500 ease-fluid"
    >
      <LoginForm :is-loading="authStore.isLoading" @submit="submit" />

      <div
        class="mt-6 text-center text-sm text-nord-3 dark:text-nord-4 border-t border-nord-4 dark:border-nord-2 pt-6"
      >
        <span>Don't have an account? </span>
        <RouterLink
          to="/register"
          class="font-bold text-nord-8 hover:underline decoration-2 underline-offset-4 transition-all"
        >
          Sign up here
        </RouterLink>
      </div>
    </div>
  </main>
</template>
