<script setup lang="js">
import { useUserStore } from '@/stores/userStore'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import EntryDetails from '@/components/EntryDetails.vue'
import UserCommentCard from '@/components/UserCommentCard.vue'
import UserVoteCard from '@/components/UserVoteCard.vue'
import { useEntrystore } from '@/stores/entryStore'
import { useVotestore } from '@/stores/voteStore'

const route = useRoute()

const userStore = useUserStore()
const entryStore = useEntrystore()
const voteStore = useVotestore()
const activeTab = ref('entries')

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      userStore.getFullProfile(newId)
      activeTab.value = 'entries'
    }
  },
  { immediate: true },
)

async function handleVoteSubmit(votePayload) {
  const success = await voteStore.castVote({
    entry_id: votePayload.entryId,
    creativity_rating: votePayload.creativityRating,
    technical_rating: votePayload.technicalRating,
    theme_respect_rating: votePayload.themeRespectRating,
  })

  if (success) {
    await entryStore.getEntryById(votePayload.entryId)

    const index = userStore.userProfile.entries.findIndex((e) => e.id === votePayload.entryId)

    if (index !== -1) {
      userStore.userProfile.entries[index] = entryStore.selectedEntry
    }
  }
}
</script>

<template>
  <main v-if="userStore.userProfile" class="max-w-5xl mx-auto space-y-8">
    <div
      class="bg-nord-5 dark:bg-nord-1 p-8 rounded-3xl border border-nord-4 dark:border-nord-2 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start"
    >
      <div class="flex flex-col items-center md:items-start text-center md:text-left gap-2">
        <h1 class="text-3xl font-black text-nord-0 dark:text-nord-6">
          {{ userStore.userProfile.first_name }} {{ userStore.userProfile.last_name }}
        </h1>
        <p class="text-sm font-medium text-nord-3 dark:text-nord-4">
          Joined {{ new Date(userStore.userProfile.inscription_date).getFullYear() }}
        </p>
      </div>

      <div
        class="grid grid-cols-2 sm:grid-cols-4 gap-4 grow w-full md:pl-8 md:border-l border-nord-4 dark:border-nord-2"
      >
        <div class="bg-nord-6 dark:bg-nord-0 p-4 rounded-xl text-center">
          <span
            class="block text-xs font-bold text-nord-3 dark:text-nord-4 uppercase tracking-wide mb-1"
            >Entries</span
          >
          <span class="text-2xl font-black text-nord-0 dark:text-nord-6">{{
            userStore.userProfile.statistics.total_entries
          }}</span>
        </div>

        <div class="bg-nord-6 dark:bg-nord-0 p-4 rounded-xl text-center">
          <span
            class="block text-xs font-bold text-nord-3 dark:text-nord-4 uppercase tracking-wide mb-1"
            >Votes Received</span
          >
          <span class="text-2xl font-black text-nord-0 dark:text-nord-6">{{
            userStore.userProfile.statistics.totalVotes || 0
          }}</span>
        </div>

        <div class="bg-nord-6 dark:bg-nord-0 p-4 rounded-xl text-center sm:col-span-2">
          <span
            class="block text-xs font-bold text-nord-3 dark:text-nord-4 uppercase tracking-wide mb-1"
            >Global Average</span
          >
          <span class="text-2xl font-black text-nord-0 dark:text-nord-6">
            {{ Number(userStore.userProfile.statistics.averages.global || 0).toFixed(1) }}
            <span class="text-sm font-medium text-nord-3 dark:text-nord-4">/ 5</span>
          </span>
        </div>
      </div>
    </div>

    <nav class="flex border-b border-nord-4 dark:border-nord-2">
      <button
        @click="activeTab = 'entries'"
        :class="[
          'px-6 py-3 font-bold text-sm transition-colors border-b-2',
          activeTab === 'entries'
            ? 'border-nord-8 text-nord-8 dark:text-nord-8'
            : 'border-transparent text-nord-3 dark:text-nord-4 hover:text-nord-0 dark:hover:text-nord-6',
        ]"
      >
        Submissions ({{ userStore.userProfile.entries.length }})
      </button>
      <button
        @click="activeTab = 'comments'"
        :class="[
          'px-6 py-3 font-bold text-sm transition-colors border-b-2',
          activeTab === 'comments'
            ? 'border-nord-8 text-nord-8 dark:text-nord-8'
            : 'border-transparent text-nord-3 dark:text-nord-4 hover:text-nord-0 dark:hover:text-nord-6',
        ]"
      >
        Comments ({{ userStore.userProfile.comments.length }})
      </button>
      <button
        @click="activeTab = 'votes'"
        :class="[
          'px-6 py-3 font-bold text-sm transition-colors border-b-2',
          activeTab === 'votes'
            ? 'border-nord-8 text-nord-8 dark:text-nord-8'
            : 'border-transparent text-nord-3 dark:text-nord-4 hover:text-nord-0 dark:hover:text-nord-6',
        ]"
      >
        Votes Cast ({{ userStore.userProfile.votes.length }})
      </button>
    </nav>

    <div
      v-if="activeTab === 'entries'"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="entry in userStore.userProfile.entries"
        :key="entry.id"
        class="flex flex-col h-full"
      >
        <EntryDetails :entry="entry" @submit="handleVoteSubmit" />
      </div>

      <div
        v-if="userStore.userProfile.entries.length === 0"
        class="col-span-full text-center py-12 text-nord-3 dark:text-nord-4"
      >
        This user hasn't submitted any photos yet.
      </div>
    </div>

    <div v-if="activeTab === 'comments'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UserCommentCard
        v-for="comment in userStore.userProfile.comments"
        :key="comment.id"
        :comment="comment"
      />
      <div
        v-if="userStore.userProfile.comments.length === 0"
        class="col-span-full text-center py-12 text-nord-3 dark:text-nord-4"
      >
        This user hasn't written any comments yet.
      </div>
    </div>

    <div v-if="activeTab === 'votes'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UserVoteCard v-for="vote in userStore.userProfile.votes" :key="vote.id" :vote="vote" />
      <div
        v-if="userStore.userProfile.votes.length === 0"
        class="col-span-full text-center py-12 text-nord-3 dark:text-nord-4"
      >
        This user hasn't cast any votes yet.
      </div>
    </div>
  </main>

  <div v-else-if="userStore.error" class="text-center py-20 text-nord-11 font-bold">
    {{ userStore.error }}
  </div>
</template>
