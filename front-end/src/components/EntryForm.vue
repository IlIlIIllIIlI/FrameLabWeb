<script setup lang="js">
import { ref } from 'vue'

const props = defineProps(['isLoading'])
const emit = defineEmits(['submit'])

const picture = ref('')

function handleFile(event) {
  picture.value = event.target.files[0]
}

function formSubmitted() {
  emit('submit', picture.value)
}
</script>

<template>
  <form @submit.prevent="formSubmitted">
    <label>
      Picture
      <input @change="handleFile" name="picture" type="file" required />
    </label>
    <div>
      <button :disabled="isLoading" class="Button" type="submit">Submit</button>
    </div>
  </form>
</template>
