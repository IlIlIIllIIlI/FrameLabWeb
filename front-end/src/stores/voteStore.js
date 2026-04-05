import { defineStore } from 'pinia'
export const useVotestore = defineStore('voteStore', {
  state: () => ({
    error: '',
    isLoading: false,
  }),
  actions: {
    async castVote(voteData) {
      this.error = ''
      this.isLoading = true

      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voteData),
      })

      if (!response.ok) {
        const data = await response.json()
        this.error = data.message
        return false
      }

      this.isLoading = false
      return true
    },
  },
})
