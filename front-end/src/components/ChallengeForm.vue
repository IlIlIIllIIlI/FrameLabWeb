<script lang="js" setup>
import { ref } from 'vue'

defineProps(['isLoading'])
const emit = defineEmits(['submit'])
const title = ref('')
const startDate = ref('')
const endDate = ref('')
const description = ref('')
const picture = ref('')

function handleFile(event) {
  picture.value = event.target.files[0]
}
function formSubmitted() {
  emit('submit', {
    title: title.value,
    description: description.value,
    startDate: startDate.value,
    endDate: endDate.value,
    picture: picture.value,
  })
}
</script>

<template>
  <form
    @submit.prevent="formSubmitted"
    class="bg-nord-5 dark:bg-nord-1 p-6 sm:p-8 rounded-2xl border border-nord-4 dark:border-nord-2 shadow-sm transition-colors duration-500 ease-fluid flex flex-col gap-5"
  >
    <div class="flex flex-col gap-1.5">
      <label for="title" class="text-sm font-semibold text-nord-1 dark:text-nord-5"
        >Challenge Title</label
      >
      <input
        id="title"
        v-model="title"
        name="title"
        placeholder="Your Title"
        type="text"
        required
        class="w-full px-4 py-2.5 rounded-lg border border-nord-4 dark:border-nord-2 bg-nord-6 dark:bg-nord-0 text-nord-0 dark:text-nord-6 placeholder-nord-3 dark:placeholder-nord-4 focus:outline-none focus:border-nord-8 focus:ring-1 focus:ring-nord-8 transition-all duration-300 ease-fluid"
      />
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="description" class="text-sm font-semibold text-nord-1 dark:text-nord-5"
        >Description</label
      >
      <textarea
        id="description"
        v-model="description"
        name="description"
        placeholder="Describe the rules and theme..."
        required
        rows="3"
        class="w-full px-4 py-3 rounded-lg border border-nord-4 dark:border-nord-2 bg-nord-6 dark:bg-nord-0 text-nord-0 dark:text-nord-6 placeholder-nord-3 dark:placeholder-nord-4 focus:outline-none focus:border-nord-8 focus:ring-1 focus:ring-nord-8 transition-all duration-300 ease-fluid resize-y"
      ></textarea>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div class="flex flex-col gap-1.5">
        <label for="start-date" class="text-sm font-semibold text-nord-1 dark:text-nord-5"
          >Start Date</label
        >
        <input
          id="start-date"
          v-model="startDate"
          name="startDate"
          type="date"
          required
          class="w-full px-4 py-2.5 rounded-lg border border-nord-4 dark:border-nord-2 bg-nord-6 dark:bg-nord-0 text-nord-0 dark:text-nord-6 focus:outline-none focus:border-nord-8 focus:ring-1 focus:ring-nord-8 transition-all duration-300 ease-fluid"
        />
      </div>
      <div class="flex flex-col gap-1.5">
        <label for="end-date" class="text-sm font-semibold text-nord-1 dark:text-nord-5"
          >End Date</label
        >
        <input
          id="end-date"
          v-model="endDate"
          name="endDate"
          type="date"
          required
          class="w-full px-4 py-2.5 rounded-lg border border-nord-4 dark:border-nord-2 bg-nord-6 dark:bg-nord-0 text-nord-0 dark:text-nord-6 focus:outline-none focus:border-nord-8 focus:ring-1 focus:ring-nord-8 transition-all duration-300 ease-fluid"
        />
      </div>
    </div>

    <label class="mt-2 block w-full">
      <span class="block text-sm font-semibold text-nord-1 dark:text-nord-5 mb-2"
        >Reference Image</span
      >
      <input
        @change="handleFile"
        name="picture"
        type="file"
        accept="image/*"
        required
        class="block w-full text-sm text-nord-3 dark:text-nord-4 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-nord-8 file:text-nord-0 hover:file:opacity-90 hover:file:-translate-y-0.5 file:transition-all file:duration-300 file:ease-snappy cursor-pointer border border-nord-4 dark:border-nord-2 rounded-lg p-1.5 bg-nord-6 dark:bg-nord-0"
      />
    </label>

    <div class="pt-2">
      <button
        :disabled="isLoading"
        class="w-full px-6 py-3 font-bold rounded-lg bg-nord-8 text-nord-0 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-snappy flex justify-center items-center h-12"
        type="submit"
      >
        <span
          v-if="isLoading"
          class="w-5 h-5 border-2 border-nord-0/30 border-t-nord-0 rounded-full animate-spin mr-2"
        ></span>
        {{ isLoading ? 'Publishing...' : 'Launch Challenge' }}
      </button>
    </div>
  </form>
</template>
