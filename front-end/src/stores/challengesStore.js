import { defineStore } from 'pinia'

export const useChallengestore = defineStore('challengeStore', {
  state: () => ({
    archivedChallenges: [],
    currentChallenge: null,
    selectedChallenge: null,
    error: '',
    isLoading: false,
  }),
  actions: {
    async getChallenges() {
      this.error = ''
      this.isLoading = true
      const response = await fetch('/api/challenges')
      const data = await response.json()
      this.archivedChallenges = data
      this.isLoading = false
    },

    async getCurrent() {
      this.error = ''
      this.isLoading = true
      const response = await fetch('/api/challenges/current')
      const data = await response.json()
      if (!response.ok) {
        if (response.status === 401) {
          this.error = data.message + ' to see the current challenge'
        } else {
          this.error = 'Sorry something happened, please try later'
        }
        this.isLoading = false
        return
      }
      if (data.success) {
        this.currentChallenge = data.challenge
      } else {
        this.error = data.message
      }
      this.isLoading = false
    },

    async createChallenge(challengeData) {
      this.error = ''
      this.isLoading = true
      const formData = new FormData()
      formData.append('title', challengeData.title)
      formData.append('description', challengeData.description)
      formData.append('start_date', challengeData.startDate)
      formData.append('end_date', challengeData.endDate)
      formData.append('picture', challengeData.picture)

      const response = await fetch('/api/challenges', {
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

    async archive(challengeId) {
      this.error = ''
      this.isLoading = true
      const response = await fetch('/api/challenge/current', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: challengeId,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        this.error = data.message
        this.isLoading = false
        return
      }

      this.isLoading = false
    },
    async getChallengeById(id) {
      this.error = ''
      this.isLoading = true
      const response = await fetch(`/api/challenges/${id}`)
      const data = await response.json()
      if (!response.ok) {
        this.error = data.message
        this.isLoading = false
        return
      }
      this.selectedChallenge = data.challenge
      this.isLoading = false
    },
  },
})
