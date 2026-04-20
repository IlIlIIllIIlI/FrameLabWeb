<script setup lang="ts">
import ChallengeDetails from '@/components/ChallengeDetails.vue'
import { useChallengestore } from '@/stores/challengesStore'
const challengesStore = useChallengestore()

challengesStore.getChallenges()
challengesStore.getCurrent()
</script>

<template>
  <main class="space-y-12">
    <div class="border-b border-nord-4 dark:border-nord-2 pb-6">
      <h1 class="text-4xl font-black text-nord-0 dark:text-nord-6 tracking-tight">Challenges</h1>
      <p class="text-nord-3 dark:text-nord-4 mt-2 text-lg">
        Participate in the current event or explore past submissions.
      </p>
    </div>

    <div v-if="challengesStore.isLoading" class="flex justify-center items-center py-12">
      <div
        class="w-10 h-10 border-4 border-nord-4 dark:border-nord-3 border-t-nord-8 dark:border-t-nord-8 rounded-full animate-spin"
      ></div>
    </div>

    <div v-if="challengesStore.currentChallenge && !challengesStore.isLoading">
      <div class="flex items-center gap-3 mb-6">
        <div class="relative flex h-3 w-3">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-nord-8 opacity-75"
          ></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-nord-8"></span>
        </div>
        <h2 class="text-2xl font-bold text-nord-0 dark:text-nord-6">Current Challenge</h2>
      </div>
      <article class="max-w-3xl">
        <ChallengeDetails :challenge="challengesStore.currentChallenge" :is-featured="true" />
      </article>
    </div>

    <div v-if="challengesStore.error" class="text-nord-11 mt-4 font-medium">
      <RouterLink
        to="/login"
        v-if="challengesStore.error.includes('logged in')"
        class="hover:underline decoration-2 underline-offset-4"
      >
        {{ challengesStore.error + '. Click here to log in' }}
      </RouterLink>
      <p v-else>{{ challengesStore.error }}</p>
    </div>

    <div v-if="challengesStore.archivedChallenges?.length > 0 && !challengesStore.isLoading">
      <h2 class="text-2xl font-bold text-nord-0 dark:text-nord-6 mb-6">Previous Challenges</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <article v-for="challenge in challengesStore.archivedChallenges" :key="challenge.id">
          <ChallengeDetails :challenge />
        </article>
      </div>
    </div>
  </main>
</template>
