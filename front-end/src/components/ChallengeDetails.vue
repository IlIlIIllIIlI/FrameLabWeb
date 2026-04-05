<script lang="js" setup>
defineProps(['challenge', 'isFeatured'])

function formatDate(dateString) {
  if (!dateString) return ''

  const date = new Date(dateString)

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <RouterLink
    :to="{ name: 'challenge', params: { id: challenge.id } }"
    class="block group outline-none"
  >
    <div
      class="bg-nord-5 dark:bg-nord-1 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ease-snappy transform group-hover:-translate-y-1 group-focus-visible:ring-4 ring-nord-8 border"
      :class="
        isFeatured
          ? 'border-nord-8 dark:border-nord-8 border-4'
          : 'border-nord-4 dark:border-nord-2'
      "
    >
      <div class="relative h-48 sm:h-56 overflow-hidden bg-nord-3 dark:bg-nord-0">
        <img
          class="w-full h-full object-cover transition-transform duration-500 ease-fluid group-hover:scale-105"
          :src="`/public/${challenge.required_picture_url}`"
          :alt="challenge.theme_title"
        />

        <div
          v-if="isFeatured"
          class="absolute top-4 right-4 bg-nord-8 text-nord-0 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md"
        >
          Active Now
        </div>
      </div>

      <div class="p-6">
        <h3
          class="text-xl font-bold text-nord-0 dark:text-nord-6 mb-2 group-hover:text-nord-8 dark:group-hover:text-nord-8 transition-colors"
        >
          {{ challenge.theme_title }}
        </h3>

        <p
          class="text-nord-1 dark:text-nord-5 line-clamp-2 mb-6 text-sm sm:text-base leading-relaxed"
        >
          {{ challenge.theme_description }}
        </p>

        <div
          class="flex items-center justify-between text-xs sm:text-sm text-nord-3 dark:text-nord-4 border-t border-nord-4 dark:border-nord-2 pt-4"
        >
          <div class="flex items-center gap-1.5">
            <p>Start Date : {{ formatDate(challenge.start_date) }}</p>
          </div>
          <div class="flex items-center gap-1.5">
            <p>End Date : {{ formatDate(challenge.end_date) }}</p>
          </div>
        </div>
      </div>
      <div class="actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </RouterLink>
</template>
