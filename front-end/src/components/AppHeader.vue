<script setup lang="js">
import { useAuthstore } from '@/stores/authStore'
import { RouterLink } from 'vue-router'

const authStore = useAuthstore()

async function logout() {
  const res = await authStore.logout()

  if (res) {
    location.reload()
  }
}
</script>

<template>
  <header class="app-header">
    <nav>
      <div>
        <RouterLink to="/"> Home </RouterLink>
      </div>

      <div>
        <template v-if="authStore.user">
          <span> Hello, {{ authStore.user.first_name }} {{ authStore.user.last_name }} ! </span>

          <RouterLink v-if="authStore.user.role === 'ADMIN'" to="/admin"> Admin Panel </RouterLink>
          <button @click="logout">Log out</button>
        </template>

        <template v-else>
          <RouterLink to="/login">Login</RouterLink>
          <RouterLink to="/register">Register</RouterLink>
        </template>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  font-size: x-large;
  position: sticky;
  z-index: 99;
  top: 0px;
}
</style>
