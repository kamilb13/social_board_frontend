<template>
  <div class="min-h-screen bg-[#E3F2FD]">
    <Navbar />
    <div class="flex justify-center">
      <!-- <Sidebar /> -->
      <div class="w-full max-w-2xl px-4 sm:px-6 lg:px-8">
        <AddPost />
        <div
          v-for="(post, index) in posts.slice().reverse()"
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
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Sidebar from '../SideBar/Sidebar.vue'
import Navbar from '../Navbar/Navbar.vue'
import AddPost from '../AddPost/AddPost.vue'
import Post from '../Post/Post.vue'

export default {
  name: 'Home',
  components: {
    Sidebar,
    Navbar,
    AddPost,
    Post,
  },
  setup() {
    const comments = ref({})
    const selectedImagePreviewEditPost = ref(null)
    const selectedImage = ref(null)
    const selectedImagePreview = ref(null)
    const store = useStore()
    const router = useRouter()

    const posts = computed(() => {
      return store.getters.getPosts
    })

    const user = computed(() => {
      return store.getters.getUser
    })

    const isAuthenticated = computed(() => {
      return store.getters.isAuthenticated
    })

    const fetchPosts = async () => {
      try {
        await store.dispatch('fetchPosts')
      } catch (error) {
        console.error('Błąd podczas pobierania postów:', error)
      }
    }

    const checkIfLogged = () => {
      if (store.getters.isAuthenticated == false) {
        router.push('login')
      }
    }

    onMounted(() => {
      checkIfLogged()
      fetchPosts()
    })

    return {
      posts,
      comments,
      checkIfLogged,
      fetchPosts,
      selectedImage,
      selectedImagePreview,
      selectedImagePreviewEditPost,
      isAuthenticated,
      user,
    }
  },
}
</script>
