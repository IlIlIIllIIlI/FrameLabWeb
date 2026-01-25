<script setup lang="js">
const props = defineProps(['comment'])

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="comment-header">
    <h3>@{{ comment.users.first_name }} {{ comment.users.last_name }}</h3>
    <span class="date">{{ formatDate(comment.date) }}</span>
  </div>
  <p class="comment-content">{{ comment.content }}</p>
</template>
