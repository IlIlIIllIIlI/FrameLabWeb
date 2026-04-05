<script lang="js" setup>
defineProps({
  comment: { type: Object, required: true },
})

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
  <RouterLink
    :to="{ name: 'entry', params: { id: comment.entries.id } }"
    class="flex gap-4 p-4 bg-nord-5 dark:bg-nord-1 rounded-xl border border-nord-4 dark:border-nord-2 hover:border-nord-8 dark:hover:border-nord-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nord-8 transition-all group"
  >
    <img
      :src="`/public/${comment.entries.edited_picture_url}`"
      class="w-16 h-16 rounded-md object-cover bg-nord-4 dark:bg-nord-0 shrink-0"
      alt="Entry Thumbnail"
    />

    <div class="grow">
      <p class="text-xs text-nord-3 dark:text-nord-4 mb-1">
        {{ formatDate(comment.date) }}
      </p>

      <p class="text-sm font-medium text-nord-0 dark:text-nord-6 line-clamp-2">
        "{{ comment.content }}"
      </p>

      <span
        class="text-xs font-bold text-nord-8 opacity-0 group-hover:opacity-100 transition-opacity mt-1 inline-block"
      >
        View Entry →
      </span>
    </div>
  </RouterLink>
</template>
