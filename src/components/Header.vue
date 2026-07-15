<template>
  <header class="bg-indigo-600 text-white p-4">
    <div class="max-w-5xl mx-auto flex items-center justify-between">
      <router-link to="/" class="text-xl font-semibold">LocalHub</router-link>
      <nav class="space-x-4">
        <router-link to="/" class="hover:underline">Home</router-link>
        <router-link to="/dashboard" class="hover:underline">Dashboard</router-link>
        <router-link to="/community" class="hover:underline">Community</router-link>
      </nav>
    </div>
  </header>
</template>
