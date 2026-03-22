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
      <h1 class="text-3xl font-black text-brand-900 dark:text-brand-accent tracking-tight mb-2">
        Welcome Back
      </h1>
      <p class="text-brand-600 dark:text-slate-400">Please log in to continue to FrameLab.</p>
    </div>
    <div
      v-if="authStore.error"
      class="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 flex items-start gap-3"
    >
      <p class="text-sm font-medium text-red-700 dark:text-red-400">{{ authStore.error }}</p>
    </div>
    <div
      class="bg-atmos-card dark:bg-brand-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-atmos-border dark:border-brand-700 transition-colors duration-500 ease-fluid"
    >
      <LoginForm :is-loading="authStore.isLoading" @submit="submit" />
      <div
        class="mt-6 text-center text-sm text-brand-600 dark:text-slate-400 border-t border-atmos-border dark:border-brand-700 pt-6"
      >
        <span>Don't have an account?</span>
        <RouterLink
          to="/register"
          class="font-bold text-brand-accent hover:underline decoration-2 underline-offset-4 transition-all"
        >
          Sign up here
        </RouterLink>
      </div>
    </div>
  </main>
</template>
