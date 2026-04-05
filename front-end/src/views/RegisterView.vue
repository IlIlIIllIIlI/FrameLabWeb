<script setup lang="js">
import RegisterForm from '@/components/RegisterForm.vue'
import { useAuthstore } from '@/stores/authStore'
import { ref } from 'vue'

const generatedLink = ref(null)
const authStore = useAuthstore()
const localError = ref('')

async function submit(credentials) {
  localError.value = ''
  if (credentials.password !== credentials.confirmPassword) {
    localError.value = 'Passwords do not match. Please try again.'
    return
  }
  const auth = await authStore.register(credentials)
  if (auth && auth.success) {
    const baseUrl = window.location.origin
    generatedLink.value = `${baseUrl}/activate?token=${auth.token}`
  }
}
</script>

<template>
  <main class="w-full max-w-lg mx-auto mt-10 sm:mt-20 px-4">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-black text-nord-0 dark:text-nord-6 tracking-tight mb-2">
        Join FrameLab
      </h1>
      <p class="text-nord-3 dark:text-nord-4">Create an account to participate in challenges.</p>
    </div>

    <div
      v-if="localError || authStore.error"
      class="mb-6 p-4 rounded-lg bg-nord-11/10 border border-nord-11/30 flex items-start gap-3"
    >
      <p class="text-sm font-medium text-nord-11">
        {{ localError || authStore.error }}
      </p>
    </div>

    <div
      class="bg-nord-5 dark:bg-nord-1 p-6 sm:p-8 rounded-2xl shadow-sm border border-nord-4 dark:border-nord-2 transition-colors duration-500 ease-fluid"
    >
      <div v-if="generatedLink" class="text-center space-y-6 py-4 animate-fade-in">
        <div
          class="w-16 h-16 bg-nord-14/20 text-nord-14 rounded-full flex items-center justify-center text-3xl mx-auto mb-2"
        >
          ✓
        </div>
        <h2 class="text-2xl font-bold text-nord-0 dark:text-nord-6">Registration Complete!</h2>
        <p class="text-nord-3 dark:text-nord-4">Please activate your account using this link:</p>

        <a
          :href="generatedLink"
          class="inline-block px-6 py-3 bg-nord-8 hover:bg-nord-7 text-nord-0 font-bold rounded-xl transition-all break-all text-sm shadow-md"
        >
          Activate My Account
        </a>
      </div>

      <div v-else>
        <RegisterForm :is-loading="authStore.isLoading" @submit="submit" />
        <div
          class="mt-6 text-center text-sm text-nord-3 dark:text-nord-4 border-t border-nord-4 dark:border-nord-2 pt-6"
        >
          Already have an account?
          <RouterLink
            to="/login"
            class="font-bold text-nord-8 hover:underline decoration-2 underline-offset-4 transition-all"
          >
            Log in here
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>
