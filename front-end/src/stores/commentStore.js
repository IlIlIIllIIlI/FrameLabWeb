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
        return false
      }

      this.isLoading = false

      return true
    },

    async deleteComment(commentId) {
      this.error = ''
      this.isLoading = true

      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        const data = await response.json()
        this.error = data.message
        return false
      }

      this.isLoading = false

      return true
    },

    async editComment(commentData) {
      this.error = ''
      this.isLoading = true

      const response = await fetch(`/api/comments/${commentData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
      })

      if (!response.ok) {
        const data = await response.json()
        this.error = data.message
        return false
      }

      this.isLoading = false
      return true

    },
  }
})
