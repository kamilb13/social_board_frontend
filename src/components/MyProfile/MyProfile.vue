<template>
  <Navbar />
  <div class="min-h-screen bg-[#E3F2FD]">
    <div class="flex justify-center">
      <div class="w-full max-w-2xl px-4 sm:px-6 lg:px-8 rounded">
        <div class="flex items-center justify-between">
          <div class="mt-6 text-center mb-10">
            <img
              :src="user.avatar ? 'http://localhost:3000/avatars/' + user.avatar : defaultAvatar"
              alt="Avatar"
              class="w-28 h-28 rounded-full shadow-lg object-cover border-4"
            />
          </div>
          <h1 class="text-xl font-bold">Witaj, {{ user.username }}</h1>
          <div
            @click="showModalEditProfile = true"
            class="m-2 p-3 bg-white hover:bg-gray-100 transition-all duration-200 rounded cursor-pointer"
          >
            Edytuj profil
          </div>
          <div
            class="fixed inset-0 bg-black flex justify-center items-center z-50"
            style="background-color: rgba(0, 0, 0, 0.1)"
            v-if="showModalEditProfile"
          >
            <div
              class="bg-white p-5 rounded shadow-lg w-full max-w-md relative transform transition-all"
            >
              <div class="flex justify-end">
                <div
                  @click="showModalEditProfile = false"
                  class="w-10 h-10 flex items-center justify-center text-3xl text-right p-1 rounded-full mb-5 cursor-pointer bg-gray-100 hover:bg-gray-200"
                >
                  X
                </div>
              </div>
              <hr />
              <p class="text-lg mt-5 mb-10 font-bold">Zdjęcie profilowe</p>
              <div v-if="!selectedImagePreview" class="flex justify-center">
                <img
                  :src="
                    user.avatar ? 'http://localhost:3000/avatars/' + user.avatar : defaultAvatar
                  "
                  alt="Avatar"
                  class="w-28 h-28 rounded-full shadow-lg object-cover"
                />
              </div>
              <div v-if="selectedImagePreview" class="flex justify-center">
                <img
                  :src="selectedImagePreview"
                  alt="Podgląd zdjęcia"
                  class="w-28 h-28 rounded-full shadow-lg object-cover"
                />
              </div>
              <div class="flex justify-between items-center mt-10">
                <input type="file" @change="handleAvatarUpload" accept="image/*" />
                <button
                  @click="addAvatar"
                  class="bg-blue-600 text-white p-2 rounded hover:bg-blue-900 cursor-pointer"
                >
                  Dodaj Avatar
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="followers.length > 0" class="mb-5">
          <h2 class="text-lg font-bold mb-2">Obserwujący:</h2>
          <div class="flex flex-wrap gap-4">
            <div v-for="(follower, index) in visibleFollowers" :key="index">
              {{ follower.username }},
            </div>
            <span
              v-if="followers.length > 3"
              @click="showModal = true"
              class="cursor-pointer text-black"
            >
              ...więcej
            </span>
          </div>
          <div
            v-if="showModal"
            class="fixed inset-0 flex items-center justify-center bg-black z-50"
            style="background-color: rgba(0, 0, 0, 0.1)"
          >
            <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
              <h3 class="text-lg font-bold mb-4">Wszyscy obserwujący:</h3>
              <ul>
                <li v-for="(follower, index) in followers" :key="index" class="mb-2">
                  {{ follower.username }}
                </li>
              </ul>
              <button
                @click="showModal = false"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 w-full"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
        <h1 class="text-xl mb-5">
          Posty użytkownika <b>{{ user.username }}</b>
        </h1>
        <p v-if="posts.length == 0">Brak postów użytkownika</p>
        <div
          v-for="(post, index) in posts"
          :key="index"
          class="bg-white shadow-md p-6 mb-6 rounded"
        >
          <Post :post="post" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex'
import Post from '../Post/Post.vue'
import Navbar from '../Navbar/Navbar.vue'

export default {
  name: 'MyProfile',
  components: {
    Post,
    Navbar,
  },
  setup() {
    const store = useStore()
    const selectedImage = ref(null)
    const selectedImagePreview = ref(null)
    const newAvatar = ref('')
    const showModalEditProfile = ref(false)
    const showModal = ref(false)

    const posts = computed(() => {
      console.log(store.getters.getPosts)
      console.log(store.getters.getPosts.filter((post) => post.author === user.value.username))

      return store.getters.getPosts.filter((post) => post.author === user.value.username)
    })

    const followers = computed(() => store.state.followers[user.value.id] || [])
    const visibleFollowers = computed(() => followers.value.slice(0, 3))

    const user = computed(() => {
      return store.getters.getUser
    })

    const isAuthenticated = computed(() => {
      return store.getters.isAuthenticated
    })

    const defaultAvatar =
      'https://icons.veryicon.com/png/o/internet--web/55-common-web-icons/person-4.png'

    const getUserPosts = async (userId) => {
      try {
        const response = await axios.get(`http://localhost:3000/posts/user/${userId}`)
        posts.value = response.data
        console.log(posts.value)
      } catch (error) {
        console.error('Nie udało się pobrać postów użytkownika', error)
      }
    }

    const handleAvatarUpload = (event) => {
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

    const addAvatar = async () => {
      if (selectedImage.value === null) {
        return
      }
      const newAvatar = new FormData()
      if (selectedImage.value) {
        newAvatar.append('image', selectedImage.value)
      }
      try {
        const response = await axios.post(
          `http://localhost:3000/users/avatar/${user.value.id}`,
          newAvatar,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        selectedImage.value = null
        user.value.avatar = response.data.avatar
        console.log(response.data)
        posts.value.push(response.data)
        selectedImagePreview.value = null
        newAvatar.value = ''
      } catch (error) {
        console.error('Błąd podczas dodawania avatara:', error)
      }
      showModalEditProfile.value = false
    }

    const getUserFollowers = async (userId) => {
      try {
        await store.dispatch('fetchFollowers', userId)
      } catch (error) {
        console.error('Nie udało się pobrać obserwujących', error)
      }
    }

    onMounted(() => {
      getUserFollowers(user.value.id)
      if (user.value) {
        getUserPosts(user.value.id)
      }
      console.log(posts.value)
      console.log(posts.value.length)
    })

    return {
      posts,
      user,
      addAvatar,
      handleAvatarUpload,
      defaultAvatar,
      newAvatar,
      getUserPosts,
      selectedImagePreview,
      showModalEditProfile,
      followers,
      visibleFollowers,
      getUserFollowers,
      showModal,
    }
  },
}
</script>

<style scoped>
input {
  cursor: pointer;
}
input[type='file']::file-selector-button {
  margin-right: 20px;
  border: none;
  background: #084cdf;
  padding: 10px 20px;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

input[type='file']::file-selector-button:hover {
  background: #0d45a5;
}
</style>
