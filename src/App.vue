<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <Header />
    <main class="mx-auto min-h-[calc(100vh-168px)] w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
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
