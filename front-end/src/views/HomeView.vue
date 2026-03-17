<script setup lang="ts">
import ChallengeDetails from '@/components/ChallengeDetails.vue'
import { useChallengestore } from '@/stores/challengesStore'
const challengesStore = useChallengestore()

challengesStore.getChallenges()
challengesStore.getCurrent()
</script>

<template>
  <main class="space-y-12">
    <div class="border-b border-atmos-border dark:border-brand-600/30 pb-6">
      <h1 class="text-4xl font-black text-brand-900 dark:text-brand-accent tracking-tight">
        Challenges
      </h1>
      <p class="text-brand-600 dark:text-slate-400 mt-2 text-lg">
        Participate in the current event or explore past submissions.
      </p>
    </div>
    <div v-if="challengesStore.isLoading" class="flex justify-center items-center py-12">
      <div
        class="w-10 h-10 border-4 border-brand-700 dark:border-brand-600 border-t-brand-accent dark:border-t-brand-accent rounded-full animate-spin"
      ></div>
    </div>
    <div v-if="challengesStore.currentChallenge && !challengesStore.isLoading">
      <div class="flex items-center gap-3 mb-6">
        <div class="relative flex h-3 w-3">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"
          ></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-brand-accent"></span>
        </div>
        <h2 class="text-2xl font-bold text-brand-800 dark:text-slate-100">Current Challenge</h2>
      </div>
      <article class="max-w-3xl">
        <ChallengeDetails :challenge="challengesStore.currentChallenge" :is-featured="true" />
      </article>
      <p class="text-red-500 mt-4 font-medium">{{ challengesStore.error }}</p>
    </div>
    <div v-if="challengesStore.archivedChallenges?.length > 0 && !challengesStore.isLoading">
      <h2 class="text-2xl font-bold text-brand-800 dark:text-slate-100 mb-6">Previous Challenge</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <article v-for="challenge in challengesStore.archivedChallenges" :key="challenge.id">
          <ChallengeDetails :challenge />
        </article>
      </div>
    </div>
  </main>
</template>
