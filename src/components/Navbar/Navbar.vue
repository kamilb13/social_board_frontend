<template>
  <header>
    <div class="flex items-center justify-between p-2 bg-[#90CAF9] shadow-sm">
      <h1
        @click="goToHome"
        class="text-2xl font-bold text-white mx-10 cursor-pointer hidden lg:block"
      >
        SocialBoard
      </h1>
      <div class="flex justify-center flex-grow relative">
        <input
          v-model="searchQuery"
          @input="searchUsers"
          placeholder="Szukaj osób..."
          class="w-full h-12 focus:ring-0 focus:border-blue-400 focus:outline-none bg-white max-w-md p-3 border border-gray-300 rounded shadow-sm transition-all resize-none"
        />
        <ul
          v-if="searchResults.length"
          class="absolute bg-white border border-gray-300 w-100 top-14 mt-1 max-h-60 overflow-auto rounded z-10"
        >
          <li
            v-for="user in searchResults"
            :key="user.id"
            @click="goToUserProfile(user.username)"
            class="cursor-pointer p-2 hover:bg-gray-100"
          >
            {{ user.username }}
          </li>
        </ul>
      </div>
      <div class="text-center mx-10 hidden lg:block">
        <img
          :src="user.avatar ? 'http://localhost:3000/avatars/' + user.avatar : defaultAvatar"
          alt="Avatar"
          class="w-15 h-15 rounded-full shadow-lg object-cover border-4"
        />
      </div>
      <h1 class="text-lg m-2 font-bold">{{ user.username }}</h1>

      <div class="flex space-x-4 gap-2 mx-10">
        <button
          @click="goToMyProfile"
          class="bg-white px-4 py-2 rounded text-black hover:bg-gray-100 transition-all duration-200 cursor-pointer"
        >
          Profil
        </button>
        <button
          @click="logout"
          class="bg-white px-4 py-2 rounded text-black hover:bg-gray-100 transition-all duration-200 cursor-pointer"
        >
          Wyloguj
        </button>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'Navbar',
  setup() {
    const searchQuery = ref('')
    const searchResults = ref([])
    const router = useRouter()
    const store = useStore()

    const user = computed(() => {
      return store.getters.getUser
    })

    const defaultAvatar =
      'https://icons.veryicon.com/png/o/internet--web/55-common-web-icons/person-4.png'

    const searchUsers = async () => {
      if (searchQuery.value.trim() === '') {
        searchResults.value = []
        return
      }
      try {
        const response = await axios.get(`http://localhost:3000/users/search`, {
          params: { query: searchQuery.value },
        })
        searchResults.value = response.data
      } catch (error) {
        console.error('Błąd wyszukiwania użytkowników:', error)
      }
    }

    const goToHome = () => {
      router.push('/')
    }

    const goToUserProfile = (username) => {
      const user = searchResults.value.find((u) => u.username === username)
      if (user) {
        router.push({
          path: '/profile',
          query: {
            userId: user.id,
            email: user.email,
            username: user.username,
          },
        })
      } else {
        console.error('Użytkownik nie znaleziony!')
      }
    }

    const goToMyProfile = () => {
      router.push('/my-profile')
    }

    const logout = () => {
      store.dispatch('logout')
      router.push('/login')
    }

    return {
      searchQuery,
      searchResults,
      goToHome,
      goToMyProfile,
      goToUserProfile,
      searchUsers,
      logout,
      user,
      defaultAvatar,
    }
  },
}
</script>
