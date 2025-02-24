<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-[#E3F2FD]">
    <div class="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center">
      <h1 class="text-5xl font-semibold text-gray-800 mb-4">404</h1>
      <h2 class="text-2xl font-medium text-gray-600 mb-2">Strona nie znaleziona</h2>
      <p class="text-gray-500 mb-6">
        Wygląda na to, że szukana strona nie istnieje lub została przeniesiona.
      </p>
      <router-link
        to="/"
        class="bg-[#90CAF9] hover:bg-blue-400 text-white text-lg font-medium py-2 px-6 rounded-full transition duration-300"
      >
        Wróć do strony głównej
      </router-link>
    </div>
  </div>
</template>
