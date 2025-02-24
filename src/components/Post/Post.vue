<template>
  <div class="bg-white transition-all duration-300">
    <div class="flex items-center justify-between">
      <div class="font-semibold rounded text-lg text-gray-800">
        <div class="text-center mb-5 flex mr-10 items-center">
          <div
            @click="goToUser(post.author)"
            class="flex items-center p-2 transition-all rounded duration-200 hover:text-blue-800 hover:bg-gray-100 cursor-pointer"
          >
            <img
              :src="avatar ? 'http://localhost:3000/avatars/' + avatar : defaultAvatar"
              alt="Avatar"
              class="w-10 h-10 rounded-full shadow-lg object-cover mr-6"
            />
            {{ post.author }}
          </div>
          <p class="text-sm mx-10 text-gray-400">{{ formatDate(post.createdAt) }}</p>
        </div>
      </div>
      <div class="relative" v-if="user?.username == post.author && !editingPostId">
        <button
          @click="toggleDropdown(post.id)"
          class="text-gray-600 font-bold hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          ⋮
        </button>

        <div
          v-if="dropdownVisible[post.id]"
          class="absolute right-0 mt-2 w-30 bg-white border border-gray-200 rounded shadow-lg z-10"
        >
          <button
            @click="startEditingPost(post)"
            class="w-full rounded flex items-center gap-2 text-black hover:bg-gray-100 px-3 py-1 transition-all duration-200 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M17.414 2.586a2 2 0 010 2.828l-10 10A2 2 0 016 16H4a1 1 0 01-1-1v-2c0-.53.21-1.04.586-1.414l10-10a2 2 0 012.828 0zM5 15h1.586L16 5.586 14.414 4 5 13.586V15z"
              />
            </svg>
            Edytuj
          </button>

          <button
            v-if="user?.username == post.author"
            @click="deletePost(post.id)"
            class="w-full rounded flex items-center gap-2 text-black hover:bg-gray-100 px-3 py-1 transition-all duration-200 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 100 2h12a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zm-4 6a1 1 0 011 1v7a1 1 0 102 0V9a1 1 0 112 0v7a1 1 0 102 0V9a1 1 0 112 0v7a1 1 0 102 0V9a1 1 0 011-1h-8z"
                clip-rule="evenodd"
              />
            </svg>
            Usuń
          </button>
        </div>
      </div>
    </div>
    <div v-if="!editingPostId" class="">
      <p class="text-gray-700 text-lg">{{ post.content }}</p>
      <div v-if="post.image" class="mt-4 flex justify-center">
        <img
          :src="'http://localhost:3000/uploads/' + post.image"
          alt="Post Image"
          class="w-100 h-100 object-cover"
        />
      </div>
      <div class="flex items-center mt-6 space-x-4 text-sm text-gray-600">
        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 122.88 107.41"
          style="enable-background: new 0 0 122.88 107.41"
          xml:space="preserve"
          width="20"
          height="20"
        >
          <g>
            <path
              class="st0"
              d="M60.83,17.19C68.84,8.84,74.45,1.62,86.79,0.21c23.17-2.66,44.48,21.06,32.78,44.41 c-3.33,6.65-10.11,14.56-17.61,22.32c-8.23,8.52-17.34,16.87-23.72,23.2l-17.4,17.26L46.46,93.56C29.16,76.9,0.95,55.93,0.02,29.95 C-0.63,11.75,13.73,0.09,30.25,0.3C45.01,0.5,51.22,7.84,60.83,17.19L60.83,17.19L60.83,17.19z"
              fill="red"
            />
          </g>
        </svg>
        <span>{{ post.likes }}</span>
        <button
          @click="likePost(post.id)"
          class="ml-4 px-4 py-2 text-white bg-blue-300 rounded hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 flex cursor-pointer"
        >
          <span>Lubię to</span>
        </button>
        <button
          @click="toggleComments(post.id)"
          class="px-4 py-2 text-white bg-[#A5D6A7] rounded hover:bg-[#86AF88] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 flex cursor-pointer"
        >
          <svg
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 121.86 122.88"
            width="20"
            height="20"
          >
            <title>comment</title>
            <path
              d="M30.28,110.09,49.37,91.78A3.84,3.84,0,0,1,52,90.72h60a2.15,2.15,0,0,0,2.16-2.16V9.82a2.16,2.16,0,0,0-.64-1.52A2.19,2.19,0,0,0,112,7.66H9.82A2.24,2.24,0,0,0,7.65,9.82V88.55a2.19,2.19,0,0,0,2.17,2.16H26.46a3.83,3.83,0,0,1,3.82,3.83v15.55ZM28.45,63.56a3.83,3.83,0,1,1,0-7.66h53a3.83,3.83,0,0,1,0,7.66Zm0-24.86a3.83,3.83,0,1,1,0-7.65h65a3.83,3.83,0,0,1,0,7.65ZM53.54,98.36,29.27,121.64a3.82,3.82,0,0,1-6.64-2.59V98.36H9.82A9.87,9.87,0,0,1,0,88.55V9.82A9.9,9.9,0,0,1,9.82,0H112a9.87,9.87,0,0,1,9.82,9.82V88.55A9.85,9.85,0,0,1,112,98.36Z"
              fill="white"
            />
          </svg>
          <span class="ml-2">Komentarze ({{ comments.length }})</span>
        </button>
      </div>
    </div>

    <div v-if="editingPostId === post.id" class="mt-4">
      <textarea
        v-model="editedPostContent"
        class="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Treść posta..."
      ></textarea>

      <input
        type="file"
        @change="handleFileUploadEditPost"
        accept="image/*"
        class="mt-3 p-3 border rounded shadow-sm w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div v-if="selectedImagePreviewEditPost" class="mt-4">
        <img
          :src="selectedImagePreviewEditPost"
          alt="Podgląd zdjęcia"
          class="w-100 h-100 object-cover rounded shadow-md"
        />
      </div>

      <div class="mt-4 flex space-x-4">
        <button
          @click="updatePost(post.id)"
          class="bg-blue-300 text-white py-2 px-4 rounded hover:bg-blue-400 transition-colors duration-200 cursor-pointer"
        >
          Zapisz zmiany
        </button>
        <button
          @click="cancelEditPost"
          class="text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100 transition-all duration-200 text-sm py-2 px-4 cursor-pointer"
        >
          Anuluj
        </button>
      </div>
    </div>

    <div v-if="isCommentVisible[post.id]" class="mt-6 p-4">
      <p v-if="!comments" class="text-gray-500">Brak komentarzy</p>
      <div class="max-h-96 overflow-y-auto space-y-4 custom-scrollbar">
        <div
          v-for="(comment, index) in comments"
          :key="index"
          class="bg-[#fbfbfb] p-4 shadow-sm mb-4 mx-3 rounded"
        >
          <Comment
            :comment="comment"
            :post="post"
            @delete-comment="deleteComment"
            @update-comment="updateComment"
          />
        </div>
      </div>
      <div class="mt-4">
        <input
          v-model="newCommentContent"
          placeholder="Dodaj komentarz..."
          class="w-full rounded p-3 focus:ring-0 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none border border-gray-200"
        />
        <div class="flex justify-end mt-3">
          <button
            v-if="newCommentContent.trim()"
            @click="addComment(post.id)"
            class="bg-green-300 hover:bg-green-400 text-white py-2 px-4 rounded transition-all duration-200 cursor-pointer"
          >
            Dodaj komentarz
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import Comment from '../Comment/Comment.vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

export default {
  name: 'Post',
  components: {
    Comment,
  },
  props: {
    post: Object,
  },
  setup(props) {
    const store = useStore()
    const user = computed(() => store.getters.getUser)
    const isCommentVisible = ref({})
    const comments = computed(() => {
      return store.getters.getComments(props.post.id)
    })

    const editingPostId = ref(null)
    const editedPostContent = ref('')
    const selectedImage = ref(null)
    const selectedImagePreviewEditPost = ref(null)
    const selectedImagePreview = ref(null)
    const newCommentContent = ref('')
    const router = useRouter()
    const editingComment = ref({})
    const editedCommentContent = ref('')
    const avatar = ref('')
    const postId = props.post.id
    const dropdownVisible = ref({})

    const formatDate = (dateString) => {
      return dayjs(dateString).format('DD.MM.YYYY HH:mm')
    }

    const toggleDropdown = (postId) => {
      dropdownVisible.value = { ...dropdownVisible.value, [postId]: !dropdownVisible.value[postId] }
    }

    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) dropdownVisible.value = {}
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    const defaultAvatar =
      'https://icons.veryicon.com/png/o/internet--web/55-common-web-icons/person-4.png'

    const likePost = async (postId) => {
      try {
        const response = await axios.post(`http://localhost:3000/like/posts/${postId}`, {
          userId: user.value.id,
        })
        const post = store.state.posts.find((p) => p.id === postId)
        if (post) post.likes = response.data.likes
      } catch (error) {
        console.error('Błąd podczas polubienia postu:', error)
      }
    }

    const deletePost = async (postId) => {
      try {
        await store.dispatch('removePost', postId)
      } catch (error) {
        console.error('Błąd podczas usuwania posta:', error)
      }
    }

    const cancelEditPost = () => {
      editingPostId.value = null
      editedPostContent.value = ''
    }

    const toggleComments = async (postId) => {
      isCommentVisible.value[postId] = !isCommentVisible.value[postId]
    }

    const goToUser = async (author) => {
      try {
        const response = await axios.get(`http://localhost:3000/users/username/${author}`)
        const userData = response.data
        router.push({
          path: '/profile',
          query: {
            userId: userData.id,
            email: userData.email,
            username: userData.username,
            avatar: userData.avatar,
          },
        })
      } catch (error) {
        console.error('Nie udało się pobrać danych użytkownika' + error)
      }
    }

    const handleFileUploadEditPost = (event) => {
      const file = event.target.files[0]
      if (file) {
        selectedImage.value = file
        const reader = new FileReader()
        reader.onload = () => {
          selectedImagePreviewEditPost.value = reader.result
        }
        reader.readAsDataURL(file)
      }
    }

    const updatePost = async (postId) => {
      if (!editedPostContent.value.trim()) return
      const postData = new FormData()
      postData.append('content', editedPostContent.value)
      if (selectedImage.value) {
        postData.append('image', selectedImage.value)
      }
      try {
        await store.dispatch('editPost', { postId, postData })
        editingPostId.value = null
        editedPostContent.value = ''
        selectedImage.value = null
        selectedImagePreview.value = null
      } catch (error) {
        console.error('Błąd podczas edycji posta:', error)
      }
    }

    const startEditingPost = (post) => {
      editingPostId.value = post.id
      editedPostContent.value = post.content
      selectedImage.value = null
      selectedImagePreviewEditPost.value = post.image
        ? `http://localhost:3000/uploads/${post.image}`
        : null
    }

    const addComment = async (postId) => {
      if (!newCommentContent.value.trim()) return
      const comment = {
        author: user.value.username,
        content: newCommentContent.value,
      }
      await store.dispatch('addComment', { postId, comment })
      newCommentContent.value = ''
    }

    const fetchComments = async (postId) => {
      try {
        await store.dispatch('fetchComments', postId)
      } catch (error) {
        console.error('Błąd podczas pobierania komentarzy:', error)
      }
    }

    onMounted(async () => {
      await fetchComments(postId)
    })

    const updateComment = async (postId, commentId, commentContent) => {
      if (!commentContent.trim()) return
      await store.dispatch('updateComment', {
        postId,
        commentId,
        content: commentContent,
      })
      editingComment.value[commentId] = false
    }

    const deleteComment = async (postId, commentId) => {
      await store.dispatch('deleteComment', { postId, commentId })
    }

    const fetchUserAvatar = async (author) => {
      try {
        const response = await axios.get(`http://localhost:3000/users/username/${author}`)
        avatar.value = response.data.avatar
      } catch (error) {
        console.error('Nie udało się pobrać danych użytkownika:', error)
      }
    }

    onMounted(() => {
      if (props.post && props.post.author) {
        fetchUserAvatar(props.post.author)
      }
    })

    return {
      avatar,
      addComment,
      user,
      comments,
      isCommentVisible,
      likePost,
      deletePost,
      cancelEditPost,
      fetchComments,
      toggleComments,
      handleFileUploadEditPost,
      updatePost,
      startEditingPost,
      editingPostId,
      editedPostContent,
      selectedImagePreview,
      selectedImage,
      selectedImagePreviewEditPost,
      newCommentContent,
      dropdownVisible,
      handleClickOutside,
      toggleDropdown,
      goToUser,
      deleteComment,
      updateComment,
      editingComment,
      editedCommentContent,
      postId,
      defaultAvatar,
      formatDate,
    }
  },
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 14px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #90caf9;
  border-radius: 10px;
  border: 2px solid #e3f2fd;
  transition: background-color 0.3s;
}
</style>
