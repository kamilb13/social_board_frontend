<template>
  <div class="flex justify-center items-center min-h-screen bg-[#E3F2FD]">
    <div class="bg-white p-6 rounded shadow-md w-96">
      <h2 class="text-xl font-bold mb-4">Rejestracja</h2>
      {{ errorMessage }}
      <form @submit.prevent="registerUser">
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          class="w-full p-3 mb-4 border rounded"
        />
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
          Zarejestruj się
        </button>
      </form>
      <div v-if="loading" class="flex justify-center items-center mt-4">
        <div class="spinner"></div>
      </div>
      <p class="mt-4 text-center">
        Masz już konto?
        <a href="#" @click="showLogin" class="text-blue-600">Zaloguj się</a>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'Register',
  setup() {
    const username = ref('')
    const email = ref('')
    const password = ref('')
    const errorMessage = ref('')
    const loading = ref(false)
    const router = useRouter()

    const registerUser = async () => {
      loading.value = true
      try {
        const response = await axios.post('http://localhost:3000/register', {
          username: username.value,
          email: email.value,
          password: password.value,
        })
        if (response.status === 201) {
          router.push('/login')
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          errorMessage.value = error.response.data
        }
        console.error('Błąd rejestracji:', error)
      } finally {
        loading.value = false
      }
    }

    const showLogin = () => {
      router.push('/login')
    }

    return {
      username,
      email,
      password,
      loading,
      registerUser,
      showLogin,
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

.profile {
  text-align: center;
}

.profile-pic {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}
</style>
