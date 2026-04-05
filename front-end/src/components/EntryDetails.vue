<script setup lang="js">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  entry: { type: Object, required: true },
  hideCommentLink: { type: Boolean, default: false },
})
const emit = defineEmits(['submit'])

const CRating = ref('')
const TRating = ref('')
const TRRating = ref('')

function formatDate(dateString) {
  if (!dateString) return ''

  const date = new Date(dateString)

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formSubmitted() {
  emit('submit', {
    entryId: props.entry.id,
    creativityRating: CRating.value,
    technicalRating: TRating.value,
    themeRespectRating: TRRating.value,
  })
}
</script>

<template>
  <div
    class="bg-nord-5 dark:bg-nord-1 border border-nord-4 dark:border-nord-2 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full transition-colors duration-500 ease-fluid"
  >
    <div class="w-full aspect-square bg-nord-4 dark:bg-nord-0 relative overflow-hidden group">
      <img
        class="w-full h-full object-cover transition-transform duration-700 ease-fluid group-hover:scale-105"
        :src="`/public/${entry.edited_picture_url}`"
        alt="User Submission"
      />
    </div>

    <div class="p-5 flex flex-col grow">
      <div
        class="flex justify-between items-start mb-4 pb-4 border-b border-nord-4 dark:border-nord-2"
      >
        <h3 class="font-bold text-nord-0 dark:text-nord-6">
          <RouterLink
            :to="`/profile/${entry.user_id}`"
            class="hover:underline decoration-2 underline-offset-4 hover:text-nord-8 transition-all"
          >
            @{{ entry.users.first_name }} {{ entry.users.last_name }}
          </RouterLink>
        </h3>
        <p class="text-sm font-medium text-nord-3 dark:text-nord-4">
          {{ formatDate(entry.submit_date) }}
        </p>
      </div>

      <form
        v-if="!entry.has_voted && !entry.challenges?.is_archived"
        @submit.prevent="formSubmitted"
        class="flex flex-col gap-4 mb-4 grow"
      >
        <div class="grid grid-cols-3 gap-3">
          <label class="flex flex-col gap-1 text-center">
            <span
              class="text-[10px] sm:text-xs font-semibold text-nord-3 dark:text-nord-4 uppercase tracking-wide"
              >Creativity</span
            >
            <input
              v-model="CRating"
              min="0"
              max="5"
              step="0.5"
              type="number"
              required
              class="w-full text-center px-2 py-1.5 rounded bg-nord-6 dark:bg-nord-0 border border-nord-4 dark:border-nord-2 text-nord-0 dark:text-nord-6 focus:ring-1 focus:ring-nord-8 focus:border-nord-8 outline-none transition-all"
            />
          </label>
          <label class="flex flex-col gap-1 text-center">
            <span
              class="text-[10px] sm:text-xs font-semibold text-nord-3 dark:text-nord-4 uppercase tracking-wide"
              >Technical</span
            >
            <input
              v-model="TRating"
              min="0"
              max="5"
              step="0.5"
              type="number"
              required
              class="w-full text-center px-2 py-1.5 rounded bg-nord-6 dark:bg-nord-0 border border-nord-4 dark:border-nord-2 text-nord-0 dark:text-nord-6 focus:ring-1 focus:ring-nord-8 focus:border-nord-8 outline-none transition-all"
            />
          </label>
          <label class="flex flex-col gap-1 text-center">
            <span
              class="text-[10px] sm:text-xs font-semibold text-nord-3 dark:text-nord-4 uppercase tracking-wide"
              >Theme</span
            >
            <input
              v-model="TRRating"
              min="0"
              max="5"
              step="0.5"
              type="number"
              required
              class="w-full text-center px-2 py-1.5 rounded bg-nord-6 dark:bg-nord-0 border border-nord-4 dark:border-nord-2 text-nord-0 dark:text-nord-6 focus:ring-1 focus:ring-nord-8 focus:border-nord-8 outline-none transition-all"
            />
          </label>
        </div>
        <button
          class="w-full py-2 bg-nord-8 text-nord-0 font-bold rounded-lg hover:bg-nord-7 transition-colors ease-snappy mt-auto"
        >
          Cast Vote
        </button>
      </form>

      <div v-else-if="entry.stats" class="flex flex-col gap-4 mb-4 grow justify-center">
        <div
          class="flex items-center justify-between pb-3 border-b border-nord-4 dark:border-nord-2"
        >
          <div>
            <h4 class="text-xs font-bold text-nord-3 dark:text-nord-4 uppercase tracking-wider">
              Community Score
            </h4>
            <p class="text-[10px] text-nord-3 dark:text-nord-4">
              {{ entry.stats.totalVotes }} votes
            </p>
          </div>
          <div class="text-2xl font-black text-nord-0 dark:text-nord-6">
            {{ Number(entry.stats.averages.global || 0).toFixed(1) }}
            <span class="text-sm text-nord-3 dark:text-nord-4 font-medium">/5</span>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2">
          <div
            class="bg-nord-6 dark:bg-nord-0 p-2 rounded-lg text-center flex flex-col items-center justify-between"
          >
            <span class="text-[10px] font-bold text-nord-3 dark:text-nord-4 uppercase">Crea</span>
            <span class="text-lg font-black text-nord-0 dark:text-nord-6">{{
              Number(entry.stats.averages.creativity || 0).toFixed(1)
            }}</span>
            <span
              v-if="entry.user_vote"
              class="text-[9px] font-bold bg-nord-8/10 text-nord-8 px-1 py-0.5 rounded-full mt-1 w-full truncate"
            >
              You: {{ entry.user_vote.creativity_rating }}
            </span>
          </div>
          <div
            class="bg-nord-6 dark:bg-nord-0 p-2 rounded-lg text-center flex flex-col items-center justify-between"
          >
            <span class="text-[10px] font-bold text-nord-3 dark:text-nord-4 uppercase">Tech</span>
            <span class="text-lg font-black text-nord-0 dark:text-nord-6">{{
              Number(entry.stats.averages.technical || 0).toFixed(1)
            }}</span>
            <span
              v-if="entry.user_vote"
              class="text-[9px] font-bold bg-nord-8/10 text-nord-8 px-1 py-0.5 rounded-full mt-1 w-full truncate"
            >
              You: {{ entry.user_vote.technical_rating }}
            </span>
          </div>
          <div
            class="bg-nord-6 dark:bg-nord-0 p-2 rounded-lg text-center flex flex-col items-center justify-between"
          >
            <span class="text-[10px] font-bold text-nord-3 dark:text-nord-4 uppercase">Theme</span>
            <span class="text-lg font-black text-nord-0 dark:text-nord-6">{{
              Number(entry.stats.averages.theme || 0).toFixed(1)
            }}</span>
            <span
              v-if="entry.user_vote"
              class="text-[9px] font-bold bg-nord-8/10 text-nord-8 px-1 py-0.5 rounded-full mt-1 w-full truncate"
            >
              You: {{ entry.user_vote.theme_respect_rating }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3 pt-4 border-t border-nord-4 dark:border-nord-2 mt-auto">
        <RouterLink
          v-if="!hideCommentLink"
          :to="{ name: 'entry', params: { id: entry.id } }"
          class="grow text-center py-2 border-2 border-nord-8 text-nord-8 font-bold rounded-lg hover:bg-nord-8 hover:text-nord-0 transition-all ease-snappy"
        >
          View Comments
        </RouterLink>
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>
