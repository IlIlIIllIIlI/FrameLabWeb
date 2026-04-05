<script setup lang="js">
import { ref } from 'vue'

defineProps(['isLoading'])
const emit = defineEmits(['submit'])

const commentText = ref('')

function formSubmitted() {
  if (commentText.value.trim() === '') return
  emit('submit', commentText.value)
  commentText.value = ''
}
</script>

<template>
  <form @submit.prevent="formSubmitted" class="flex flex-col gap-4">
    <div class="flex flex-col gap-1.5">
      <label for="comment" class="text-sm font-semibold text-nord-1 dark:text-nord-5">
        Leave a Comment
      </label>

      <textarea
        id="comment"
        v-model="commentText"
        name="comment"
        placeholder="What do you think about this submission?"
        required
        rows="3"
        class="w-full px-4 py-3 rounded-xl border border-nord-4 dark:border-nord-2 bg-nord-6 dark:bg-nord-0 text-nord-0 dark:text-nord-6 placeholder-nord-3 dark:placeholder-nord-4 focus:outline-none focus:border-nord-8 focus:ring-1 focus:ring-nord-8 transition-all duration-300 ease-fluid resize-y"
      />
    </div>

    <div class="flex justify-end">
      <button
        :disabled="isLoading"
        type="submit"
        class="px-6 py-2.5 font-bold rounded-lg bg-nord-8 text-nord-0 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-snappy flex items-center gap-2"
      >
        <span
          v-if="isLoading"
          class="w-4 h-4 border-2 border-nord-0/30 border-t-nord-0 rounded-full animate-spin"
        ></span>
        {{ isLoading ? 'Posting...' : 'Post Comment' }}
      </button>
    </div>
  </form>
</template>
