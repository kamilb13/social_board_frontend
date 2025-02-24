<template>
  <div class="mb-12 mt-5 bg-white shadow p-4 rounded">
    <textarea
      v-model="newPost"
      placeholder="Co u Ciebie słychać?"
      class="w-full rounded focus:ring-0 focus:border-transparent focus:outline-none resize-none p-4 border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
    ></textarea>

    <input
      type="file"
      @change="handleFileUpload"
      accept="image/*"
      class="mr-10 mt-4 p-3 border border-gray-300 cursor-pointer hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 rounded"
    />

    <div v-if="selectedImagePreview" class="mt-4">
      <img :src="selectedImagePreview" alt="Podgląd zdjęcia" class="w-100 h-100 h-auto rounded" />
    </div>

    <button
      @click="addPost"
      class="bg-blue-400 text-white p-4 mt-4 text-mg hover:bg-[#90CAF9] transition-all duration-200 cursor-pointer rounded"
    >
      Dodaj Post
    </button>
  </div>
</template>
<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex'

export default {
  name: 'AddPost',
  setup() {
    const newPost = ref('')
    const selectedImagePreview = ref(null)
    const store = useStore()
    const selectedImage = ref(null)

    const posts = computed(() => {
      return store.getters.getPosts
    })

    const user = computed(() => {
      return store.getters.getUser
    })

    const addPost = async () => {
      if (newPost.value.trim()) {
        const postData = new FormData()
        postData.append('author', user.value.username)
        postData.append('content', newPost.value)

        if (selectedImage.value) {
          postData.append('image', selectedImage.value)
        }

        try {
          await store.dispatch('createPost', postData)

          newPost.value = ''
          selectedImage.value = null
          selectedImagePreview.value = null
        } catch (error) {
          console.error('Błąd podczas dodawania postu:', error)
        }
      }
    }

    const handleFileUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        selectedImage.value = file
        const reader = new FileReader()
        reader.onload = () => {
          selectedImagePreview.value = reader.result
        }
        reader.readAsDataURL(file)
      }
    }

    return {
      addPost,
      handleFileUpload,
      newPost,
      user,
      selectedImagePreview,
    }
  },
}
</script>
