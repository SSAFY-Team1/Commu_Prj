<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Header />
    <main class="container-max flex-1 p-4">
      <div class="px-4 sm:px-6 lg:px-8">
        <router-view />
      </div>
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
