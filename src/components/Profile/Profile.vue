<template>
  <Navbar />
  <div class="min-h-screen bg-[#E3F2FD]">
    <div class="flex justify-center">
      <div class="w-full max-w-2xl px-4 sm:px-6 lg:px-8 rounded">
        <div class="flex items-center space-x-20">
          <div class="mt-6 text-center mb-10">
            <img
              :src="avatar ? 'http://localhost:3000/avatars/' + avatar : defaultAvatar"
              alt="Avatar"
              class="w-28 h-28 rounded-full shadow-lg object-cover border-4"
            />
          </div>
          <h1 class="text-xl font-bold">{{ username }}</h1>
          <p>Obserwujący: {{ followers.length }}</p>
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

        <div class="flex items-center space-x-4" v-if="user.username != username">
          <button
            @click="toggleFollow"
            class="bg-blue-500 text-white px-4 py-2 rounded-md transition-all duration-200 hover:bg-blue-600 cursor-pointer mb-10"
          >
            {{ isFollowing ? 'Przestań obserwować' : 'Obserwuj' }}
          </button>
        </div>

        <h1 class="text-xl mb-5">
          Posty użytkownika <b>{{ username }}</b>
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
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import Post from '../Post/Post.vue'
import Navbar from '../Navbar/Navbar.vue'
import store from '../../store'

export default {
  name: 'Profile',
  components: {
    Post,
    Navbar,
  },

  setup() {
    const route = useRoute()
    const username = ref(route.query.username)
    const email = ref(route.query.email)
    const userId = ref(route.query.userId)
    const avatar = ref(route.query.avatar)
    const posts = computed(() => {
      return store.getters.getPosts.filter((post) => post.author === username.value)
    })
    const showModal = ref(false)

    const followers = computed(() => store.state.followers[userId.value] || [])

    const visibleFollowers = computed(() => followers.value.slice(0, 3))

    const user = computed(() => store.getters.getUser)

    const defaultAvatar =
      'https://icons.veryicon.com/png/o/internet--web/55-common-web-icons/person-4.png'

    const isFollowing = computed(() => {
      const userFollowers = store.getters.getFollowers(userId.value)
      return userFollowers.some((follower) => follower.id === store.state.user.id)
    })

    const getUserPosts = async (userId) => {
      try {
        const response = await axios.get(`http://localhost:3000/posts/user/${userId}`)
        posts.value = response.data
      } catch (error) {
        console.error('Nie udało się pobrać postów użytkownika', error)
      }
    }

    const getUserFollowers = async (userId) => {
      try {
        await store.dispatch('fetchFollowers', userId)
      } catch (error) {
        console.error('Nie udało się pobrać obserwujących', error)
      }
    }

    const toggleFollow = async () => {
      try {
        if (isFollowing.value) {
          await store.dispatch('unfollow', {
            followerId: store.state.user.id,
            followedId: userId.value,
          })
        } else {
          await store.dispatch('follow', {
            followerId: store.state.user.id,
            followedId: userId.value,
          })
        }
        await getUserFollowers(userId.value)
      } catch (error) {
        console.error('Nie udało się zmienić stanu obserwowania', error)
      }
    }

    onMounted(() => {
      getUserPosts(userId.value)
      getUserFollowers(userId.value)
    })

    return {
      user,
      username,
      email,
      avatar,
      posts,
      defaultAvatar,
      userId,
      followers,
      visibleFollowers,
      isFollowing,
      toggleFollow,
      showModal,
    }
  },
}
</script>

<style scoped>
input {
  cursor: pointer;
}
</style>
