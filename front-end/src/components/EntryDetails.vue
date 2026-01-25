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
  <div class="entry-card">
    <div class="user">
      <h3>@{{ `${entry.users.first_name} ${entry.users.last_name}` }}</h3>
    </div>
    <p>{{ formatDate(entry.submit_date) }}</p>
    <img :src="`/public/${entry.edited_picture_url}`" />
    <form @submit.prevent="formSubmitted" class="votes">
      <label>
        Creativity Rating
        <input v-model="CRating" min="0" max="5" name="Creativity Rating" type="number" />
      </label>
      <label>
        Technical Rating
        <input v-model="TRating" min="0" max="5" name="Technical Rating" type="number" />
      </label>
      <label>
        Theme Respect Rating
        <input v-model="TRRating" min="0" max="5" name="Theme Respect Rating" type="number" />
      </label>
      <button>Submit Vote</button>
    </form>
    <RouterLink v-if="!hideCommentLink" :to="{ name: 'entry', params: { id: entry.id } }">
      <button>Comments</button>
    </RouterLink>
    <div class="actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>
