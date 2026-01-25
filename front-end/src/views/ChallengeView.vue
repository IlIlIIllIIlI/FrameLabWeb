<script lang="js" setup>
import ChallengeDetails from '@/components/ChallengeDetails.vue'
import EntryDetails from '@/components/EntryDetails.vue'
import EntryForm from '@/components/EntryForm.vue'
import { useAuthstore } from '@/stores/authStore'
import { useVotestore } from '@/stores/voteStore'
import { useChallengestore } from '@/stores/challengesStore'
import { useEntrystore } from '@/stores/entryStore'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const authStore = useAuthstore()
const challengesStore = useChallengestore()
const entryStore = useEntrystore()
const voteStore = useVotestore()
const route = useRoute()
const challengeId = route.params.id

onMounted(async () => {
  await challengesStore.getChallengeById(challengeId)
})
async function submit(entryData) {
  const entry = entryStore.createEntry({
    challengeId: challengeId,
    userId: authStore.user.id,
    picture: entryData,
  })
  if (entry) {
    await challengesStore.getChallengeById(challengeId)
  }
}

function vote(voteData) {
  const vote = voteStore.castVote({
    userId: authStore.user.id,
    entryId: voteData.entryId,
    creativityRating: voteData.creativityRating,
    technicalRating: voteData.technicalRating,
    themeRespectRating: voteData.themeRespectRating,
  })
}
</script>
<template>
  <main v-if="challengesStore.selectedChallenge">
    <ChallengeDetails :challenge="challengesStore.selectedChallenge" />

    <section v-if="!challengesStore.selectedChallenge.is_archived">
      <h2>Submit your Entry</h2>
      <EntryForm :is-loading="challengesStore.isLoading" @submit="submit" />
      <p>{{ entryStore.error }}</p>
    </section>

    <section>
      <h2>Submissions</h2>
      <article v-for="entry in challengesStore.selectedChallenge.entries" :key="entry.id">
        <EntryDetails :entry :is-loading="challengesStore.isLoading" @submit="vote" />
        <p>{{ voteStore.error }}</p>
      </article>
    </section>
  </main>
  <div v-else>
    <p v-if="challengesStore.error.length === 0">Loading challenge....</p>
    <p>{{ challengesStore.error }}</p>
  </div>
</template>
