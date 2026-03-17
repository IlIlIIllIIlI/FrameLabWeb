<script setup lang="js">
import { useAuthstore } from '@/stores/authStore'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const authStore = useAuthstore()
const isDark = ref(false)

async function logout() {
  const res = await authStore.logout()

  if (res) {
    location.reload()
  }
}
onMounted(() => {
  // Initialize theme
  applyTheme(getThemePreference())
})
// Apply theme on load
function getThemePreference() {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    return savedTheme
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
    isDark.value = true
  } else {
    document.documentElement.classList.remove('dark')
    isDark.value = false
  }
}

// Theme toggle function
function toggleTheme() {
  const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'

  applyTheme(newTheme)
  localStorage.setItem('theme', newTheme)
}
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-brand-900/80 border-b border-brand-700/20 dark:border-brand-600/30 transition-colors duration-500 ease-fluid"
  >
    <nav
      aria-label="Main Navigation"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16"
    >
      <div class="flex items-center">
        <RouterLink
          to="/"
          class="text-2xl font-black tracking-widest text-brand-700 dark:text-brand-accent uppercase flex items-center gap-2 hover:opacity-80 hover:-translate-y-0.5 transition-all duration-500 ease-snappy"
          aria-label="FrameLab Home"
        >
          <span>FrameLab</span>
        </RouterLink>
      </div>

      <div class="flex items-center gap-4 sm:gap-6">
        <button
          @click="toggleTheme"
          class="p-2 rounded-full text-brand-700 dark:text-brand-accent hover:bg-brand-700/10 dark:hover:bg-brand-600/30 hover:-translate-y-0.5 transition-all duration-500 ease-snappy"
          title="Toggle Dark Mode"
        >
          {{ isDark ? 'DarkMode' : 'LightMode' }}
        </button>

        <template v-if="authStore.user">
          <span class="hidden sm:block text-sm font-medium text-brand-800 dark:text-slate-200">
            Hello,<strong class="text-brand-accent">{{ authStore.user.first_name }}</strong
            >!</span
          >

          <RouterLink
            v-if="authStore.user.role === 'ADMIN'"
            to="/admin"
            class="text-sm font-semibold text-brand-600 dark:text-brand-accent hover:underline decoration-2 underline-offset-4 hover:-translate-y-0.5 transition-all duration-500 ease-snappy"
          >
            Admin Panel
          </RouterLink>
          <button
            @click="logout"
            class="px-4 py-2 text-sm font-bold rounded-lg border-2 border-brand-700 dark:border-brand-accent text-brand-700 dark:text-brand-accent hover:bg-brand-700 hover:text-white dark:hover:bg-brand-accent dark:hover:text-brand-900 hover:-translate-y-0.5 transition-all duration-500 ease-snappy"
          >
            Log out
          </button>
        </template>

        <template v-else>
          <RouterLink
            to="/login"
            class="text-sm font-semibold text-brand-700 dark:text-slate-200 hover:text-brand-accent dark:hover:text-brand-accent hover:-translate-y-0.5 transition-all duration-500 ease-snappy"
            >Login</RouterLink
          >
          <RouterLink
            to="/register"
            class="px-5 py-2 text-sm font-bold rounded-lg bg-brand-accent text-brand-900 shadow-[0_0_15px_rgba(218,138,139,0.4)] hover:shadow-[0_0_20px_rgba(218,138,139,0.7)] hover:-translate-y-0.5 transition-all duration-500 ease-snappy"
            >Register</RouterLink
          >
        </template>
      </div>
    </nav>
  </header>
</template>
