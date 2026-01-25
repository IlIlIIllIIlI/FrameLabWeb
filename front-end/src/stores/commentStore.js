import { defineStore } from 'pinia'
export const useCommentstore = defineStore('commentStore', {
  state: () => ({
    error: '',
    isLoading: false,
  }),
  actions: {
    async addComment(commentData) {
      this.error = ''
      this.isLoading = true

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
      })

      if (!response.ok) {
        const data = await response.json()
        this.error = data.message
      }

      this.isLoading = false
    },
  },
})
