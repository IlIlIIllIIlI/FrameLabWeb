import { defineStore } from 'pinia'

export const useEntrystore = defineStore('entryStore', {
  state: () => ({
    selectedEntry: null,
    error: '',
    isLoading: false,
  }),
  actions: {
    async createEntry(entryData) {
      this.error = ''
      this.isLoading = true
      const formData = new FormData()
      formData.append('userId', entryData.userId)
      formData.append('challengeId', entryData.challengeId)
      formData.append('picture', entryData.picture)

      const response = await fetch('/api/entries', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (!response.ok) {
        this.error = data.message
        this.isLoading = false
        return
      }

      this.error = data.message
      this.isLoading = false
    },
    async getEntryById(Id) {
      this.error = ''
      this.isLoading = true
      this.selectedEntry = null

      const response = await fetch(`/api/entries/${Id}`)
      const data = await response.json()
      if (!response.ok) {
        this.error = data.message
        this.isLoading = false
        return
      }
      this.selectedEntry = data.entry
      this.isLoading = false
    },
  },
})
