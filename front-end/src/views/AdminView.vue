<script setup lang="ts">
import ChallengeForm from '@/components/ChallengeForm.vue'
import ChallengeDetails from '@/components/ChallengeDetails.vue'
import { useChallengestore } from '@/stores/challengesStore'
const challengesStore = useChallengestore()

function submit(challengeData) {
  const challenge = challengesStore.createChallenge(challengeData)
  if (challenge) {
    challengesStore.getCurrent()
  }
}

function archive() {
  if (
    !confirm(
      'Are you sure you want to archive this challenge? Users will no longer be able to submit entries.',
    )
  )
    return
  const archive = challengesStore.archive(challengesStore.currentChallenge.id)
  if (archive) {
    challengesStore.getCurrent()
  }
}

challengesStore.getCurrent()
</script>

<template>
  <main class="space-y-8">
    <div class="border-b border-nord-4 dark:border-nord-2 pb-6 flex items-center gap-3">
      <div>
        <h1 class="text-3xl font-black text-nord-0 dark:text-nord-6 tracking-tight">
          Admin Dashboard
        </h1>
        <p class="text-nord-3 dark:text-nord-4 mt-1">Manage events and active challenges.</p>
      </div>
    </div>

    <div
      v-if="challengesStore.error"
      class="p-4 rounded-lg bg-nord-11/10 border border-nord-11/30 flex items-start gap-3"
    >
      <p class="text-sm font-medium text-nord-11">{{ challengesStore.error }}</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <section class="lg:col-span-7 space-y-4">
        <h2 class="text-xl font-bold text-nord-0 dark:text-nord-6 flex items-center gap-2">
          <span class="w-2 h-6 rounded bg-nord-8 block"></span> Launch New Challenge
        </h2>

        <ChallengeForm :is-loading="challengesStore.isLoading" @submit="submit" />
      </section>

      <section class="lg:col-span-5 space-y-4">
        <h2 class="text-xl font-bold text-nord-0 dark:text-nord-6 flex items-center gap-2">
          <span class="relative flex h-3 w-3">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-nord-8 opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-nord-8"></span>
          </span>
          Currently Active
        </h2>

        <div v-if="challengesStore.currentChallenge" class="relative">
          <ChallengeDetails :challenge="challengesStore.currentChallenge" :is-featured="true">
            <template #actions>
              <button
                @click.prevent="archive"
                class="w-full mt-4 py-2.5 px-4 font-bold text-nord-11 border-2 border-nord-11/50 rounded-lg hover:bg-nord-11/10 transition-all duration-300 ease-snappy flex justify-center items-center gap-2"
              >
                Archive the challenge
              </button>
            </template>
          </ChallengeDetails>
        </div>

        <div
          v-else
          class="text-center py-12 px-6 bg-nord-5 dark:bg-nord-1 rounded-2xl border-2 border-dashed border-nord-4 dark:border-nord-2"
        >
          <p class="text-nord-1 dark:text-nord-5 font-bold">No active challenge</p>
          <p class="text-sm text-nord-3 dark:text-nord-4 mt-1">
            Use the form to create and launch a new one.
          </p>
        </div>
      </section>
    </div>
  </main>
</template>
