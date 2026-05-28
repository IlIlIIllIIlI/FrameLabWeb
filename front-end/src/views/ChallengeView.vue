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
import router from '@/router'

const authStore = useAuthstore()
const challengesStore = useChallengestore()
const entryStore = useEntrystore()
const voteStore = useVotestore()
const route = useRoute()
const challengeId = route.params.id

onMounted(async () => {
  await challengesStore.getChallengeById(challengeId)

  if (!challengesStore.selectedChallenge.is_archived && !authStore.user) {
    router.push('/login')
  }
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

async function vote(voteData) {
  const success = await voteStore.castVote({
    userId: authStore.user.id,
    entryId: voteData.entryId,
    creativityRating: voteData.creativityRating,
    technicalRating: voteData.technicalRating,
    themeRespectRating: voteData.themeRespectRating,
  })

  if (success) {
    await entryStore.getEntryById(voteData.entryId)

    const index = challengesStore.selectedChallenge.entries.findIndex(
      (e) => e.id === voteData.entryId,
    )

    if (index !== -1) {
      challengesStore.selectedChallenge.entries[index] = entryStore.selectedEntry
    }
  }
}
</script>
<template>
  <RouterLink
    :to="{ name: 'home' }"
    class="inline-flex items-center gap-2 text-sm font-bold text-nord-8 hover:underline underline-offset-4 transition-all mb-6"
  >
    <span aria-hidden="true">←</span> Back to Home
  </RouterLink>
  <main v-if="challengesStore.selectedChallenge" class="space-y-12">
    <div class="border-b border-nord-4 dark:border-nord-2 pb-6">
      <h1 class="text-4xl font-black text-nord-0 dark:text-nord-6 tracking-tight">Challenge</h1>
      <p class="text-nord-3 dark:text-nord-4 mt-2 text-lg">
        Participate in the current event or view others entries.
      </p>
    </div>

    <ChallengeDetails :challenge="challengesStore.selectedChallenge" class="pointer-events-none" />

    <section
      v-if="!challengesStore.selectedChallenge.is_archived"
      class="max-w-2xl mx-auto"
    ></section>

    <section>
      <div
        class="flex justify-between items-end mb-6 border-b border-nord-4 dark:border-nord-2 pb-4"
      >
        <h2 class="text-3xl font-black text-nord-0 dark:text-nord-6">
          Submissions
          <span class="text-nord-3 dark:text-nord-4 font-medium text-lg"
            >({{ challengesStore.selectedChallenge.entries?.length || 0 }})</span
          >
        </h2>
      </div>

      <div
        v-if="voteStore.error"
        class="mb-6 p-4 rounded-lg bg-nord-11/10 text-nord-11 font-bold border border-nord-11/30 text-center"
      >
        {{ voteStore.error }}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <article v-for="entry in challengesStore.selectedChallenge.entries" :key="entry.id">
          <EntryDetails :entry="entry" :is-loading="challengesStore.isLoading" @submit="vote" />
        </article>
      </div>
    </section>
  </main>

  <div v-else class="flex flex-col items-center justify-center py-20 text-center">
    <div v-if="challengesStore.error.length === 0" class="flex flex-col items-center gap-4">
      <div
        class="w-10 h-10 border-4 border-nord-4 dark:border-nord-3 border-t-nord-8 rounded-full animate-spin"
      ></div>
      <p class="text-nord-3 dark:text-nord-4 font-medium animate-pulse">
        Loading challenge details...
      </p>
    </div>

    <p
      v-else
      class="text-nord-11 font-bold text-xl bg-nord-11/10 px-6 py-4 rounded-xl border border-nord-11/30"
    >
      {{ challengesStore.error }}
    </p>
  </div>
</template>
