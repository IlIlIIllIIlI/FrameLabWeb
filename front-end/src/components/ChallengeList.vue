<script lang="js" setup>
const props = defineProps(['challenges'])
</script>

<template>
  <article v-for="challenge in challenges" key="challenge.id"></article>
</template>
