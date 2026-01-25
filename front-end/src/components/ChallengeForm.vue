<script lang="js" setup>
import { ref } from 'vue'

const props = defineProps(['isLoading'])
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
  <form @submit.prevent="formSubmitted">
    <label>
      Title
      <input v-model="title" name="title" placeholder="Title" type="text" required />
    </label>
    <label>
      Description
      <textarea
        v-model="description"
        name="description"
        placeholder="Description"
        required
      ></textarea>
    </label>
    <label>
      Start Date
      <input v-model="startDate" name="startDate" type="date" required />
    </label>
    <label>
      End Date
      <input v-model="endDate" name="endDate" type="date" required />
    </label>
    <label>
      Picture
      <input @change="handleFile" name="picture" type="file" required />
    </label>
    <div>
      <button :disabled="isLoading" class="Button" type="submit">Submit</button>
    </div>
  </form>
</template>
