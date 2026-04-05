<script setup lang="js">
import CommentForm from '@/components/CommentForm.vue'
import EntryDetails from '@/components/EntryDetails.vue'
import { useAuthstore } from '@/stores/authStore'
import { useCommentstore } from '@/stores/commentStore'
import { useEntrystore } from '@/stores/entryStore'
import { useVotestore } from '@/stores/voteStore'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import CommentDetails from '@/components/CommentDetails.vue'

const authStore = useAuthstore()
const route = useRoute()
const entryStore = useEntrystore()
const commentStore = useCommentstore()
const voteStore = useVotestore()
const entryId = route.params.id

onMounted(async () => {
  await entryStore.getEntryById(route.params.id)
})

async function vote(voteData) {
  const vote = voteStore.castVote({
    userId: authStore.user.id,
    entryId: voteData.entryId,
    creativityRating: voteData.creativityRating,
    technicalRating: voteData.technicalRating,
    themeRespectRating: voteData.themeRespectRating,
  })

  if (vote) {
    await entryStore.getEntryById(entryId)
  }
}

async function submitComment(commentText) {
  const create = await commentStore.addComment({
    userId: authStore.user.id,
    entryId: entryId,
    content: commentText,
  })

  if (create) {
    await entryStore.getEntryById(entryId)
  }
}

async function editComment(commentData) {
  const edit = await commentStore.editComment(commentData)

  if (edit) {
    await entryStore.getEntryById(entryId)
  }
}

async function deleteComment(commentId) {
  const del = await commentStore.deleteComment(commentId)

  if (del) {
    await entryStore.getEntryById(entryId)
  }
}
</script>

<template>
  <main v-if="entryStore.selectedEntry" class="max-w-3xl mx-auto space-y-10">
    <section>
      <RouterLink
        :to="{ name: 'challenge', params: { id: entryStore.selectedEntry.challenge_id } }"
        class="inline-flex items-center gap-2 text-sm font-bold text-nord-8 hover:underline underline-offset-4 transition-all mb-6"
      >
        <span aria-hidden="true">←</span> Back to Gallery
      </RouterLink>

      <EntryDetails :hide-comment-link="true" :entry="entryStore.selectedEntry" @submit="vote" />
    </section>

    <section
      v-if="!entryStore.selectedEntry.challenges.is_archived"
      class="bg-nord-5 dark:bg-nord-1 p-6 rounded-2xl border border-nord-4 dark:border-nord-2 shadow-sm transition-colors duration-500 ease-fluid"
    >
      <CommentForm :is-loading="commentStore.isLoading" @submit="submitComment" />

      <p
        v-if="commentStore.error"
        class="mt-4 p-3 rounded bg-nord-11/10 text-nord-11 text-sm font-medium border border-nord-11/30"
      >
        {{ commentStore.error }}
      </p>
    </section>

    <section>
      <div class="border-b border-nord-4 dark:border-nord-2 pb-4 mb-6">
        <h2 class="text-2xl font-black text-nord-0 dark:text-nord-6">
          Comments
          <span class="text-nord-3 dark:text-nord-4 font-medium text-lg"
            >({{ entryStore.selectedEntry.comments.length }})</span
          >
        </h2>
      </div>

      <div
        v-if="entryStore.selectedEntry.comments.length === 0"
        class="text-center py-12 bg-nord-5 dark:bg-nord-1 rounded-2xl border-2 border-dashed border-nord-4 dark:border-nord-2"
      >
        <p class="text-nord-3 dark:text-nord-4 text-lg">No comments for now. Be the first!</p>
      </div>

      <div v-else class="space-y-4">
        <article v-for="comment in entryStore.selectedEntry.comments" :key="comment.id">
          <CommentDetails :comment="comment" @update="editComment" @delete="deleteComment" />
        </article>
      </div>
    </section>
  </main>

  <div v-else class="flex flex-col items-center justify-center py-20 text-center">
    <div v-if="entryStore.error.length === 0" class="flex flex-col items-center gap-4">
      <div
        class="w-10 h-10 border-4 border-nord-4 dark:border-nord-3 border-t-nord-8 rounded-full animate-spin"
      ></div>
      <p class="text-nord-3 dark:text-nord-4 font-medium animate-pulse">Loading entry...</p>
    </div>

    <p
      v-else
      class="text-nord-11 font-bold text-xl bg-nord-11/10 px-6 py-4 rounded-xl border border-nord-11/30"
    >
      {{ entryStore.error }}
    </p>
  </div>
</template>
