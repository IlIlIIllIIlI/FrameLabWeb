<script setup lang="ts">
import ChallengeForm from '@/components/ChallengeForm.vue'
import ChallengeDetails from '@/components/ChallengeDetails.vue'
import { useChallengestore } from '@/stores/challengesStore'
const challengesStore = useChallengestore()

function submit(challengeData) {
  const challenge = challengesStore.createChallenge(challengeData)
  if (challenge) {
    // yipee
  }
}

function archive() {
  const archive = challengesStore.archive(challengesStore.currentChallenge.id)
  if (archive) {
    //yipee
  }
}

challengesStore.getCurrent()
</script>

<template>
  <main>
    <h1>Admin Panel</h1>
    <section>
      <h3>Create a challenge</h3>
      <p class="error">{{ challengesStore.error }}</p>
      <ChallengeForm :is-loading="challengesStore.isLoading" @submit="submit" />
    </section>
    <div>
      <h3>Current Challenge</h3>
      <article v-if="challengesStore.currentChallenge">
        <ChallengeDetails :challenge="challengesStore.currentChallenge">
          <template #actions>
            <button @click.prevent="archive">Archive the challenge</button>
          </template>
        </ChallengeDetails>
      </article>
      <p class="error">{{ challengesStore.error }}</p>
    </div>
  </main>
</template>
