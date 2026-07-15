<template>
  <div class="min-h-screen bg-gray-100">
    <Header />
    <main class="max-w-5xl mx-auto p-4">
      <router-view />
    </main>
    <Footer />
    <Chatbot />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Chatbot from './components/Chatbot.vue'

export default {
  components: { Header, Footer, Chatbot }
}
</script>
