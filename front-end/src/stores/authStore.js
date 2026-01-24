import { defineStore } from 'pinia'

export const useAuthstore = defineStore('authStore', {
  state: () => ({
    user: '',
    error: '',
    isLoading: false,
  }),
  actions: {
    async login(credentials) {
      this.error = ''
      this.isLoading = true
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        this.error = 'Sorry something happened, please try later'
        this.isLoading = false
        return
      }

      const data = await response.json()

      if (data.success) {
        this.user = data.user.firstName + ' ' + data.user.lastName
        this.isLoading = false
        this.error = ''
        return true
      } else {
        this.error = data.message
        this.isLoading = false
        return false
      }
    },
    async register(credentials) {
      this.error = ''
      this.isLoading = true
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        this.error = 'Sorry something happened, please try later'
        this.isLoading = false
        return
      }

      const data = await response.json()

      if (data.success) {
        this.user = data.user.firstName + ' ' + data.user.lastName
        this.isLoading = false
        this.error = ''
        return true
      } else {
        this.error = data.message
        this.isLoading = false
        return false
      }
    },
  },
})
