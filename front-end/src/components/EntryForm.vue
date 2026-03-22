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
  <form
    @submit.prevent="formSubmitted"
    class="bg-atmos-card dark:bg-brand-800 p-6 sm:p-8 rounded-2xl border border-atmos-border dark:border-brand-700 shadow-sm transition-colors duration-500 ease-fluid"
  >
    <div class="flex flex-col sm:flex-row gap-4 items-end">
      <label>
        Picture
        <input @change="handleFile" name="picture" type="file" required />
      </label>
      <div>
        <button :disabled="isLoading" class="Button" type="submit">Submit</button>
      </div>
    </div>
  </form>
</template>
