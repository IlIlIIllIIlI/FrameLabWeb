<script setup lang="js">
import { ref } from 'vue'

defineProps(['isLoading'])
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
    class="bg-nord-5 dark:bg-nord-1 p-6 sm:p-8 rounded-2xl border border-nord-4 dark:border-nord-2 shadow-sm transition-colors duration-500 ease-fluid"
  >
    <div class="flex flex-col sm:flex-row gap-4 items-end">
      <label class="grow w-full">
        <span class="block text-sm font-semibold text-nord-1 dark:text-nord-5 mb-2">
          Select Your Picture
        </span>
        <input
          @change="handleFile"
          name="picture"
          type="file"
          accept="image/*"
          required
          class="block w-full text-sm text-nord-3 dark:text-nord-4 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-nord-8 file:text-nord-0 hover:file:opacity-90 hover:file:-translate-y-0.5 file:transition-all file:duration-300 file:ease-snappy file:cursor-pointer cursor-pointer border border-nord-4 dark:border-nord-2 rounded-lg p-1.5 bg-nord-6 dark:bg-nord-0"
        />
      </label>

      <button
        :disabled="isLoading"
        type="submit"
        class="w-full sm:w-auto px-6 py-3 font-bold rounded-lg bg-nord-8 text-nord-0 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-snappy flex justify-center items-center h-11.5"
      >
        <span
          v-if="isLoading"
          class="w-4 h-4 border-2 border-nord-0/30 border-t-nord-0 rounded-full animate-spin mr-2"
        ></span>
        {{ isLoading ? 'Uploading...' : 'Submit' }}
      </button>
    </div>
  </form>
</template>
