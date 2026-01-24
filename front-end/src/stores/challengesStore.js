export const useChallengestore = defineStore('challengeStore', {
  state: () => ({
    title: '',
    description: '',
    picture: '',
    error: '',
    isLoading: false,
  }),
  actions: {
    async submitChallenge(params) {},
  },
})
