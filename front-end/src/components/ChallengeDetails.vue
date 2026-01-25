<script lang="js" setup>
const props = defineProps(['challenge'])

function formatDate(dateString) {
  if (!dateString) return ''

  const date = new Date(dateString)

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <RouterLink :to="{ name: 'challenge', params: { id: challenge.id } }">
    <div class="challenge">
      <h3>{{ challenge.theme_title }}</h3>
      <p>{{ challenge.theme_description }}</p>
      <div class="dates">
        <p>Start Date : {{ formatDate(challenge.start_date) }}</p>
        <p>End Date : {{ formatDate(challenge.end_date) }}</p>
      </div>
      <img :src="`/public/${challenge.required_picture_url}`" />
      <div class="actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </RouterLink>
</template>
