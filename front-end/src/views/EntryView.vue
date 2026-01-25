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

function vote(voteData) {
  const vote = voteStore.castVote({
    userId: authStore.user.id,
    entryId: voteData.entryId,
    creativityRating: voteData.creativityRating,
    technicalRating: voteData.technicalRating,
    themeRespectRating: voteData.themeRespectRating,
  })
}

async function submitComment(commentText) {
  const success = await commentStore.addComment({
    userId: authStore.user.id,
    entryId: entryId,
    content: commentText,
  })
}
</script>

<template>
  <main v-if="entryStore.selectedEntry">
    <EntryDetails :hide-comment-link="true" :entry="entryStore.selectedEntry" @submit="vote" />

    <section v-if="!entryStore.selectedEntry.challenges.is_archived">
      <h2>Add a comment</h2>
      <CommentForm :is-loading="commentStore.isLoading" @submit="submitComment" />
      <p class="error">{{ commentStore.error }}</p>
    </section>

    <section>
      <h2>Comments ({{ entryStore.selectedEntry.comments.length }})</h2>
      <p v-if="entryStore.selectedEntry.comments.length === 0" class="no-comments">
        No comments for now, be first
      </p>
      <article v-for="comment in entryStore.selectedEntry.comments" :key="comment.id">
        <CommentDetails :comment />
        <p>{{ commentStore.error }}</p>
      </article>
    </section>
  </main>

  <div v-else>
    <p v-if="entryStore.error.length === 0">Loading Entry...</p>
    <p class="error">{{ entryStore.error }}</p>
  </div>
</template>
