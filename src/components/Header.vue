<template>
  <header class="bg-indigo-600 text-white p-4">
    <div class="max-w-5xl mx-auto flex items-center justify-between">
      <router-link to="/" class="text-xl font-semibold">LocalHub</router-link>

      <!-- Desktop nav -->
      <nav class="hidden md:flex space-x-4">
        <router-link to="/" class="hover:underline">Home</router-link>
        <router-link to="/dashboard" class="hover:underline">Dashboard</router-link>
        <router-link to="/community" class="hover:underline">Community</router-link>
      </nav>

      <!-- Mobile menu button -->
      <button
        @click="open = !open"
        class="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
        :aria-expanded="open"
        aria-label="메뉴 열기"
      >
        <svg v-if="!open" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile dropdown -->
    <transition name="slide-down">
      <div v-if="open" class="md:hidden mt-2 bg-indigo-700">
        <div class="max-w-5xl mx-auto p-2 flex flex-col">
          <router-link @click.native="open=false" to="/" class="block px-3 py-2 rounded hover:bg-indigo-600">Home</router-link>
          <router-link @click.native="open=false" to="/dashboard" class="block px-3 py-2 rounded hover:bg-indigo-600">Dashboard</router-link>
          <router-link @click.native="open=false" to="/community" class="block px-3 py-2 rounded hover:bg-indigo-600">Community</router-link>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<style>
.slide-down-enter-active, .slide-down-leave-active { transition: max-height .25s ease; }
.slide-down-enter-from, .slide-down-leave-to { max-height: 0; overflow: hidden }
.slide-down-enter-to, .slide-down-leave-from { max-height: 300px; overflow: hidden }
</style>
