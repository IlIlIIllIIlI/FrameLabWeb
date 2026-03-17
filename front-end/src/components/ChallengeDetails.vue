<script lang="js" setup>
const props = defineProps(['challenge', 'isFeatured'])

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
      class="bg-atmos-card dark:bg-brand-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ease-snappy transform group-hover:-translate-y-1 group-focus-visible:ring-4 ring-brand-accent border"
      :class="
        isFeatured
          ? 'border-brand-accent dark:border-brand-accent border-4'
          : 'border-atmos-border dark:border-brand-700'
      "
    >
      <div class="relative h-48 sm:h-56 overflow-hidden bg-brand-800">
        <img
          class="w-full h-full object-cover transition-transform duration-500 ease-fluid group-hover:scale-105"
          :src="`/public/${challenge.required_picture_url}`"
          :alt="challenge.theme_title"
        />
        <div
          v-if="isFeatured"
          class="absolute top-4 right-4 bg-brand-accent text-brand-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md"
        >
          Active Now
        </div>
      </div>
      <div class="p-6">
        <h3
          class="text-xl font-bold text-brand-900 dark:text-slate-100 mb-2 group-hover:text-brand-accent transition-colors"
        >
          {{ challenge.theme_title }}
        </h3>
        <p
          class="text-brand-700 dark:text-slate-300 line-clamp-2 mb-6 text-sm sm:text-base leading-relaxed"
        >
          {{ challenge.theme_description }}
        </p>
        <div
          class="flex items-center justify-between text-xs sm:text-sm text-brand-600 dark:text-slate-400 border-t border-atmos-border dark:border-brand-700 pt-4"
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
