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
    class="sticky top-0 z-50 w-full backdrop-blur-md bg-nord-6/90 dark:bg-nord-0/90 border-b border-nord-4 dark:border-nord-1 transition-colors duration-500 ease-fluid"
  >
    <nav
      aria-label="Main Navigation"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16"
    >
      <div class="flex items-center">
        <RouterLink
          to="/"
          class="text-xl sm:text-2xl font-black tracking-widest text-nord-0 dark:text-nord-6 hover:text-nord-8 dark:hover:text-nord-8 uppercase flex items-center gap-2 hover:-translate-y-0.5 transition-all duration-500 ease-snappy"
          aria-label="FrameLab Home"
        >
          <span>FrameLab</span>
        </RouterLink>
      </div>

      <div class="flex items-center gap-4 sm:gap-6">
        <button
          @click="toggleTheme"
          class="text-sm p-2 rounded-full text-nord-3 dark:text-nord-4 hover:bg-nord-4/50 dark:hover:bg-nord-1 hover:-translate-y-0.5 transition-all duration-500 ease-snappy"
          title="Toggle Dark Mode"
        >
          <span v-if="isDark" class="material-icons"> dark_mode </span>
          <span v-else class="material-icons"> light_mode </span>
        </button>

        <template v-if="authStore.user">
          <RouterLink
            :to="{ name: 'profile', params: { id: authStore.user.id } }"
            class="hidden sm:block text-sm font-medium text-nord-1 dark:text-nord-5 hover:text-nord-0 dark:hover:text-nord-6 transition-colors group"
          >
            Hello,
            <strong
              class="text-nord-8 group-hover:underline decoration-2 underline-offset-4 transition-all"
            >
              {{ authStore.user.first_name }} </strong
            >!
          </RouterLink>

          <RouterLink
            v-if="authStore.user.is_admin"
            to="/admin"
            class="text-sm font-semibold text-nord-9 dark:text-nord-9 hover:underline decoration-2 underline-offset-4 hover:-translate-y-0.5 transition-all duration-500 ease-snappy"
          >
            Admin Dashboard
          </RouterLink>
          <button
            @click="logout"
            class="px-4 py-2 text-sm font-bold rounded-lg border-2 border-nord-8 text-nord-8 hover:bg-nord-8 hover:text-nord-0 dark:hover:text-nord-0 hover:-translate-y-0.5 transition-all duration-500 ease-snappy"
          >
            Log out
          </button>
        </template>

        <template v-else>
          <RouterLink
            to="/login"
            class="text-sm font-semibold text-nord-1 dark:text-nord-5 hover:text-nord-8 dark:hover:text-nord-8 hover:-translate-y-0.5 transition-all duration-500 ease-snappy"
            >Login</RouterLink
          >
          <RouterLink
            to="/register"
            class="px-5 py-2 text-sm font-bold rounded-lg bg-nord-8 text-nord-0 shadow-[0_0_15px_rgba(136,192,208,0.4)] hover:shadow-[0_0_20px_rgba(136,192,208,0.7)] hover:-translate-y-0.5 transition-all duration-500 ease-snappy"
            >Register</RouterLink
          >
        </template>
      </div>
    </nav>
  </header>
</template>
