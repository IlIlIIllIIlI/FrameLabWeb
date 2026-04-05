<script setup lang="js">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthstore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthstore()

const status = ref('loading')
const errorMessage = ref('')

onMounted(async () => {
  const token = route.query.token

  if (!token) {
    status.value = 'error'
    errorMessage.value = 'No activation token found in the URL.'
    return
  }

  const result = await authStore.verifyAccount(token)

  if (result) {
    status.value = 'success'

    setTimeout(() => {
      router.push('/')
    }, 3000)
  } else {
    status.value = 'error'
    errorMessage.value = authStore.error || 'Invalid or expired activation link.'
  }
})
</script>

<template>
  <main class="min-h-[60vh] flex items-center justify-center p-4">
    <div
      class="max-w-md w-full bg-nord-5 dark:bg-nord-1 p-8 rounded-3xl shadow-sm border border-nord-4 dark:border-nord-2 text-center transition-all"
    >
      <div v-if="status === 'loading'" class="flex flex-col items-center gap-4">
        <div
          class="w-12 h-12 border-4 border-nord-4 dark:border-nord-3 border-t-nord-8 dark:border-t-nord-8 rounded-full animate-spin"
        ></div>
        <h1 class="text-2xl font-black text-nord-0 dark:text-nord-6">Verifying Account...</h1>
        <p class="text-nord-3 dark:text-nord-4">Please wait while we validate your token.</p>
      </div>

      <div
        v-else-if="status === 'success'"
        class="flex flex-col items-center gap-4 animate-fade-in"
      >
        <div
          class="w-16 h-16 bg-nord-14/20 text-nord-14 rounded-full flex items-center justify-center text-3xl mb-2"
        >
          ✓
        </div>
        <h1 class="text-2xl font-black text-nord-0 dark:text-nord-6">Account Verified!</h1>
        <p class="text-nord-3 dark:text-nord-4">Your account is now active.</p>
        <p class="text-sm font-bold text-nord-8 animate-pulse mt-4">
          Redirecting you to the Main Page...
        </p>
      </div>

      <div v-else class="flex flex-col items-center gap-4 animate-fade-in">
        <div
          class="w-16 h-16 bg-nord-11/20 text-nord-11 rounded-full flex items-center justify-center text-3xl mb-2"
        >
          ✕
        </div>
        <h1 class="text-2xl font-black text-nord-0 dark:text-nord-6">Verification Failed</h1>
        <p
          class="text-nord-11 font-medium bg-nord-11/10 p-3 rounded-lg w-full border border-nord-11/30"
        >
          {{ errorMessage }}
        </p>
        <RouterLink
          to="/register"
          class="mt-4 px-6 py-2 bg-nord-8 hover:bg-nord-7 text-nord-0 font-bold rounded-xl transition-colors"
        >
          Back to Registration
        </RouterLink>
      </div>
    </div>
  </main>
</template>
