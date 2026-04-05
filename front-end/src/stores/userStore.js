import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
    state: () => ({
        userProfile: null,
        isLoading: false,
        error: ''
    }),
    actions: {
        async getFullProfile(userId) {
            this.isLoading = true
            this.error = ''
            this.userProfile = null
            const response = await fetch(`/api/users/${userId}?full=true`)
            const data = await response.json()

            if (!response.ok || !data.success) {
                if (data.message) {
                    this.error = data.message
                } else {
                    this.error = 'Failed to load user profile'
                }

                this.isLoading = false
                return
            }

            this.userProfile = data.user
            this.isLoading = false
            return;

        }
    }
})