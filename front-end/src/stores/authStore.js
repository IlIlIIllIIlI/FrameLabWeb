import { defineStore } from 'pinia'

export const useAuthstore = defineStore('authStore', {
  state: () => ({
    user: null,
    error: '',
    isLoading: false,
    isAppLoading: true
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

      const data = await response.json()

      if (!response.ok) {
        this.error = data.message
        this.isLoading = false
        return
      }


      if (data.success) {
        this.user = data.user
        this.isLoading = false
        this.error = ''
        return true
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
        try {
          const data = await response.json()
          this.error = data.message || 'Sorry something happened, please try later'
          this.isLoading = false
          return { success: false }

        } catch {
          this.error = 'Sorry something happened, please try later'
          this.isLoading = false
          return
        }
      }

      const data = await response.json()

      if (!data.success) {
        this.error = data.message || 'Sorry something happened, please try later'
        this.isLoading = false
        return { success: false }
      }

      this.isLoading = false
      this.error = ''

      return { success: true, token: data.token }
    },
    async verifyAccount(token) {
      this.error = ''
      this.isLoading = true


      const response = await fetch(`/api/auth/verify?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()
      this.isLoading = false

      if (data.success) {
        return true
      } else {
        this.error = data.message
        return false
      }

    },
    async checkUser() {
      this.error = ''
      this.isAppLoading = true;

      const response = await fetch('/api/auth/me')

      if (response.ok) {
        const data = await response.json()
        this.user = data.user
      } else {
        this.user = null
      }
      this.isAppLoading = false;
    },
    async logout() {
      this.error = ''
      this.isLoading = true

      const response = await fetch('/api/auth/logout')

      if (response.ok) {
        this.user = null
        this.loading = false


        return true
      }
      this.isLoading = false


      return false
    }
  },
})
