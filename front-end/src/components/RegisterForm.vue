<script lang="js" setup>
import { ref } from 'vue'

const props = defineProps(['isLoading'])
const emit = defineEmits(['submit'])
const email = ref('')
const firstName = ref('')
const lastName = ref('')
const password = ref('')
function formSubmitted() {
  emit('submit', {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
  })
}
</script>

<template>
  <form @submit.prevent="formSubmitted" class="flex flex-col gap-5">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div class="flex flex-col gap-1.5">
        <label for="first-name" class="text-sm font-semibold text-brand-800 dark:text-slate-200">
          First Name
        </label>
        <input
          id="first-name"
          v-model="firstName"
          name="first-name"
          placeholder="First Name"
          type="text"
          required
          class="w-full px-4 py-2.5 rounded-lg border border-atmos-border dark:border-brand-600 bg-white dark:bg-brand-900/50 text-brand-900 dark:text-slate-100 placeholder-brand-600/40 dark:placeholder-slate-500 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-300 ease-fluid"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="last-name" class="text-sm font-semibold text-brand-800 dark:text-slate-200">
          Last Name
        </label>
        <input
          id="last-name"
          v-model="lastName"
          name="last-name"
          placeholder="Last Name"
          type="text"
          required
          class="w-full px-4 py-2.5 rounded-lg border border-atmos-border dark:border-brand-600 bg-white dark:bg-brand-900/50 text-brand-900 dark:text-slate-100 placeholder-brand-600/40 dark:placeholder-slate-500 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-300 ease-fluid"
        />
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <label for="last-name" class="text-sm font-semibold text-brand-800 dark:text-slate-200">
        Email Address
      </label>
      <input
        id="email"
        v-model="email"
        name="email"
        placeholder="you@example.com"
        type="email"
        required
        class="w-full px-4 py-2.5 rounded-lg border border-atmos-border dark:border-brand-600 bg-white dark:bg-brand-900/50 text-brand-900 dark:text-slate-100 placeholder-brand-600/40 dark:placeholder-slate-500 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-300 ease-fluid"
      />
    </div>
    <div class="flex flex-col gap-1.5">
      <label for="password" class="text-sm font-semibold text-brand-800 dark:text-slate-200">
        Password
      </label>
      <input
        for="password"
        v-model="password"
        name="password"
        placeholder="Password"
        type="password"
        required
        class="w-full px-4 py-2.5 rounded-lg border border-atmos-border dark:border-brand-600 bg-white dark:bg-brand-900/50 text-brand-900 dark:text-slate-100 placeholder-brand-600/40 dark:placeholder-slate-500 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-300 ease-fluid"
      />
    </div>
    <div class="pt-2">
      <button
        :disabled="isLoading"
        type="submit"
        class="w-full px-5 py-3 text-base font-bold rounded-lg bg-brand-accent text-brand-900 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-300 ease-snappy flex justify-center items-center"
      >
        <span
          v-if="isLoading"
          class="w-5 h-5 border-2 border-brand-900/30 border-t-brand-900 rounded-full animate-spin mr-2"
        ></span>
        {{ isLoading ? 'Creating Account...' : 'Create Account' }}
      </button>
    </div>
  </form>
</template>
