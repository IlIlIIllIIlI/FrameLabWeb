<script setup lang="ts">
import ChallengeDetails from '@/components/ChallengeDetails.vue'
import { useChallengestore } from '@/stores/challengesStore'
const challengesStore = useChallengestore()

challengesStore.getChallenges()
challengesStore.getCurrent()
</script>

<template>
  <main>
    <h1>Challenges</h1>
    <div v-if="challengesStore.isLoading" class="loading">Loading Challenges...</div>
    <div>
      <h3>Current Challenge</h3>
      <article v-if="challengesStore.currentChallenge">
        <ChallengeDetails :challenge="challengesStore.currentChallenge" />
      </article>
      <p class="error">{{ challengesStore.error }}</p>
    </div>
    <div>
      <h3>Previous Challenge</h3>
      <article v-for="challenge in challengesStore.archivedChallenges" :key="challenge.id">
        <ChallengeDetails :challenge />
      </article>
    </div>
  </main>
</template>
