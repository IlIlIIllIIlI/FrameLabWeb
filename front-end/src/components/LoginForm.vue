<script lang="js" setup>
import { ref } from 'vue'

const props = defineProps(['isLoading'])
const emit = defineEmits(['submit'])
const email = ref('')
const password = ref('')
function formSubmitted() {
  emit('submit', { email: email.value, password: password.value })
}
</script>

<template>
  <form @submit.prevent="formSubmitted">
    <label>
      Email Address
      <input v-model="email" name="email" placeholder="Email Address" type="text" required />
    </label>
    <label>
      Password
      <input v-model="password" name="password" placeholder="Password" type="password" required />
    </label>
    <div>
      <button :disabled="isLoading" class="Button" type="submit">Log In</button>
    </div>
  </form>
</template>
