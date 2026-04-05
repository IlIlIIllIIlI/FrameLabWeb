<script setup lang="js">
import { useAuthstore } from '@/stores/authStore'
import { computed, ref } from 'vue'
const props = defineProps(['comment'])
const emits = defineEmits(['update', 'delete'])

const isEditing = ref(false)
const editContent = ref(props.comment.content)

const authStore = useAuthstore()
const isOwner = computed(() => {
  return authStore.user?.id == props.comment.user_id
})

const isAdmin = computed(() => {
  return authStore.user?.is_admin
})

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function saveEdit() {
  if (editContent.value.trim() === '') {
    return
  }

  emits('update', { id: props.comment.id, content: editContent.value })
  isEditing.value = false
}

function cancelEdit() {
  editContent.value = props.comment.content
  isEditing.value = false
}

function deleteComment() {
  if (confirm('Are you sure you want to delete this comment ? ')) {
    emits('delete', props.comment.id)
  }
}
</script>

<template>
  <div
    class="bg-nord-5 dark:bg-nord-1 p-5 rounded-xl border border-nord-4 dark:border-nord-2 transition-colors duration-500 ease-fluid group"
  >
    <div class="flex justify-between items-start mb-3">
      <div>
        <h3 class="font-bold text-nord-0 dark:text-nord-8">
          <RouterLink
            :to="`/profile/${comment.user_id}`"
            class="hover:underline decoration-2 underline-offset-4 hover:text-nord-8 transition-all"
          >
            @{{ comment.users.first_name }} {{ comment.users.last_name }}
          </RouterLink>
        </h3>
        <span class="text-xs font-medium text-nord-3 dark:text-nord-4">
          {{ formatDate(comment.date) }}
        </span>
      </div>

      <div
        v-if="(isAdmin && !isEditing) || (isOwner && !isEditing)"
        class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <button
          v-if="isOwner"
          @click="isEditing = true"
          class="text-sm font-bold text-nord-3 dark:text-nord-4 hover:text-nord-8 dark:hover:text-nord-8 transition-colors"
          title="Edit"
        >
          Edit
        </button>
        <button
          @click="deleteComment"
          class="text-sm font-bold text-nord-11 hover:opacity-80 transition-opacity"
          title="Delete"
        >
          Delete
        </button>
      </div>
    </div>

    <p
      v-if="!isEditing"
      class="text-nord-1 dark:text-nord-5 text-sm leading-relaxed whitespace-pre-wrap"
    >
      {{ comment.content }}
    </p>

    <div v-else class="flex flex-col gap-3 mt-2">
      <textarea
        v-model="editContent"
        rows="3"
        class="w-full px-3 py-2 text-sm rounded-lg border border-nord-4 dark:border-nord-2 bg-nord-6 dark:bg-nord-0 text-nord-0 dark:text-nord-6 placeholder-nord-3 dark:placeholder-nord-4 focus:outline-none focus:border-nord-8 focus:ring-1 focus:ring-nord-8 transition-all resize-y"
      ></textarea>

      <div class="flex justify-end gap-3">
        <button
          @click="cancelEdit"
          class="px-4 py-1.5 text-sm font-bold text-nord-3 dark:text-nord-4 hover:text-nord-0 dark:hover:text-nord-6 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="saveEdit"
          class="px-4 py-1.5 text-sm font-bold bg-nord-8 text-nord-0 rounded-lg hover:bg-nord-7 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>
