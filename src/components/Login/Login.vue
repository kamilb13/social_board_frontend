<template>
  <div class="flex justify-center items-center min-h-screen bg-[#E3F2FD]">
    <div class="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 class="text-xl font-bold mb-4">Logowanie</h2>
      {{ errorMessage }}
      <form @submit.prevent="login">
        <input
          v-model="email"
          type="email"
          placeholder="E-mail"
          class="w-full p-3 mb-4 border rounded"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Hasło"
          class="w-full p-3 mb-4 border rounded"
        />
        <button
          type="submit"
          class="w-full bg-[#90CAF9] hover:bg-blue-400 transition-all duration-200 text-white py-2 rounded cursor-pointer"
          :disabled="loading"
        >
          Zaloguj się
        </button>
      </form>
      <div v-if="loading" class="flex justify-center items-center mt-4">
        <div class="spinner"></div>
      </div>
      <p class="mt-4 text-center">
        Nie masz konta?
        <a href="#" @click="showRegister" class="text-blue-600">Zarejestruj się</a>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'Login',
  setup() {
    const email = ref('')
    const password = ref('')
    const errorMessage = ref('')
    const loading = ref(false)
    const store = useStore()
    const router = useRouter()

    const login = async () => {
      loading.value = true
      try {
        const response = await axios.post('http://localhost:3000/login', {
          email: email.value,
          password: password.value,
        })
        if (response.status === 200) {
          // console.log(response.data.user)
          store.dispatch('login', response.data.user)
          router.push('/')
        }
      } catch (error) {
        if (error.response.status === 400) {
          errorMessage.value = error.response.data
        }
        console.error('Błąd logowania:', error)
      } finally {
        loading.value = false
      }
    }

    const showRegister = () => {
      router.push('/register')
    }

    return {
      email,
      password,
      loading,
      login,
      showRegister,
      errorMessage,
    }
  },
}
</script>

<style scoped>
.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
