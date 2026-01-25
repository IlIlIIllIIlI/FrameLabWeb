<script setup lang="js">
import { ref } from 'vue'

const props = defineProps(['isLoading'])
const emit = defineEmits(['submit'])

const commentText = ref('')

function formSubmitted() {
  if (commentText.value.trim() === '') return
  emit('submit', commentText.value)
  commentText.value = ''
}
</script>

<template>
  <form @submit.prevent="formSubmitted">
    <label>
      Comment
      <textarea v-model="commentText" name="comment" placeholder="Your comment" required></textarea>
    </label>
    <div>
      <button :disabled="isLoading" class="Button" type="submit">Submit</button>
    </div>
  </form>
</template>
