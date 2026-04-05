<script lang="js" setup>
defineProps({
  vote: { type: Object, required: true },
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
    :to="{ name: 'entry', params: { id: vote.entries.id } }"
    class="flex items-start sm:items-center gap-4 p-4 bg-nord-5 dark:bg-nord-1 rounded-xl border border-nord-4 dark:border-nord-2 hover:border-nord-8 dark:hover:border-nord-8 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nord-8"
  >
    <img
      :src="`/public/${vote.entries.edited_picture_url}`"
      class="w-16 h-16 rounded-md object-cover bg-nord-4 dark:bg-nord-0 flex-shrink-0"
      alt="Entry Thumbnail"
    />

    <div class="flex-grow w-full">
      <div class="flex justify-between items-center mb-2">
        <span class="text-xs font-medium text-nord-3 dark:text-nord-4">
          {{ formatDate(vote.vote_date) }}
        </span>
        <span
          class="text-xs font-bold text-nord-8 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          View →
        </span>
      </div>

      <div class="grid grid-cols-3 gap-2">
        <div class="text-center bg-nord-6 dark:bg-nord-0 rounded py-1">
          <span
            class="block text-[10px] font-bold text-nord-3 dark:text-nord-4 uppercase tracking-wider"
            >Creativity</span
          >
          <span class="font-black text-nord-0 dark:text-nord-6">{{ vote.creativity_rating }}</span>
        </div>

        <div class="text-center bg-nord-6 dark:bg-nord-0 rounded py-1">
          <span
            class="block text-[10px] font-bold text-nord-3 dark:text-nord-4 uppercase tracking-wider"
            >Technical</span
          >
          <span class="font-black text-nord-0 dark:text-nord-6">{{ vote.technical_rating }}</span>
        </div>

        <div class="text-center bg-nord-6 dark:bg-nord-0 rounded py-1">
          <span
            class="block text-[10px] font-bold text-nord-3 dark:text-nord-4 uppercase tracking-wider"
            >Theme</span
          >
          <span class="font-black text-nord-0 dark:text-nord-6">{{
            vote.theme_respect_rating
          }}</span>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
