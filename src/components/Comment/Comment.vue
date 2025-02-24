<template>
  <div class="flex items-center justify-between">
    <div class="font-semibold text-gray-800">{{ comment.author }}</div>
    <div class="relative" v-if="user?.username === comment.author">
      <button
        @click="toggleDropdown(post.id)"
        class="text-gray-600 font-bold hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
      >
        ⋮
      </button>
      <div
        v-if="dropdownVisible[post.id]"
        class="absolute right-0 top-5 w-30 bg-white border border-gray-200 rounded shadow-lg z-10"
      >
        <button
          @click="startEditingComment(comment.id, comment.content)"
          class="w-full rounded flex items-center gap-2 text-black hover:bg-gray-100 px-3 py-1 transition-all duration-200 cursor-pointer"
        >
          ✏️ Edytuj
        </button>
        <button
          @click="deleteComment"
          class="w-full rounded flex items-center gap-2 text-black hover:bg-gray-100 px-3 py-1 transition-all duration-200 cursor-pointer"
        >
          🗑️ Usuń
        </button>
      </div>
    </div>
  </div>
  <p v-if="!editingComment[comment.id]" class="text-gray-700 mt-2">
    {{ comment.content }}
  </p>
  <div v-else class="mt-2">
    <input v-model="editedCommentContent" class="border p-3 rounded w-full" />
    <div class="flex justify-end">
      <button
        @click="updateComment"
        class="px-4 mt-3 py-2 text-white bg-[#A5D6A7] rounded hover:bg-[#86AF88] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 flex cursor-pointer"
      >
        Zapisz
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'Comment',
  emits: ['delete-comment', 'update-comment'],
  props: {
    comment: Object,
    post: Object,
  },
  setup(props, { emit }) {
    const user = computed(() => store.getters.getUser)
    const store = useStore()
    const dropdownVisible = ref({})
    const editingComment = ref({})
    const editedCommentContent = ref(props.comment.content)

    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) dropdownVisible.value = {}
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    const toggleDropdown = (postId) => {
      dropdownVisible.value[postId] = !dropdownVisible.value[postId]
    }

    const startEditingComment = (commentId, content) => {
      editingComment.value[commentId] = true
      editedCommentContent.value = content
      dropdownVisible.value = false
    }

    const deleteComment = () => {
      emit('delete-comment', props.post.id, props.comment.id)
      dropdownVisible.value = false
    }

    const updateComment = () => {
      emit('update-comment', props.post.id, props.comment.id, editedCommentContent.value)
      editingComment.value[props.comment.id] = false
    }

    return {
      user,
      deleteComment,
      updateComment,
      editingComment,
      editedCommentContent,
      dropdownVisible,
      toggleDropdown,
      startEditingComment,
      handleClickOutside,
    }
  },
})
</script>
