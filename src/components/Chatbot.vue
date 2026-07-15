<template>
  <div>
    <button @click="open = true" class="fixed right-4 bottom-4 bg-blue-500 text-white p-3 rounded-full shadow-lg">💬</button>
    <div v-if="open" class="fixed right-4 bottom-20 w-80 bg-white shadow-lg border rounded p-3">
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-semibold">챗봇</h3>
        <button @click="open=false" class="text-gray-500">✕</button>
      </div>
        <div class="h-40 overflow-auto mb-2">
          <div v-if="loading" class="chat-loading">
            <Spinner />
            <div class="text-sm text-gray-500">응답을 요청 중입니다...</div>
          </div>
          <div v-else>
            <div v-for="(m, idx) in messages" :key="idx" class="mb-2">
              <div class="text-sm text-gray-700"><strong v-if="m.role==='user'">You:</strong><strong v-else>Bot:</strong> {{ m.text }}</div>
            </div>
          </div>
        </div>
      <div class="flex">
        <input v-model="input" @keyup.enter="send" class="flex-1 border p-2 rounded" placeholder="질문을 입력하세요"/>
        <button @click="send" class="ml-2 bg-indigo-600 text-white px-3 py-2 rounded">전송</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { sendChat } from '../services/chatApi'
import Spinner from './Spinner.vue'
import { loadSampleData } from '../utils/dataLoader'

export default {
  setup() {
    const open = ref(false)
    const messages = ref([])
    const input = ref('')
    const loading = ref(false)

    async function send() {
      if (!input.value.trim()) return
      const userText = input.value.trim()
      messages.value.push({ role: 'user', text: userText })
      input.value = ''
      loading.value = true
      try {
        // 간단한 키워드 기반 컨텍스트 추출
        const data = await loadSampleData()
        const q = userText.toLowerCase().split(/\s+/).filter(Boolean)
        const matched = data.filter(item => q.some(k => (item.name||'').toLowerCase().includes(k) || (item.category||'').toLowerCase().includes(k) || (item.description||'').toLowerCase().includes(k)))
        const context = matched.slice(0,5).map(i => ({ id: i.id, name: i.name, category: i.category, address: i.address }))

        const res = await sendChat(userText, { context })
        messages.value.push({ role: 'bot', text: res?.answer || '응답 없음' })
      } catch (e) {
        messages.value.push({ role: 'bot', text: '오류가 발생했습니다.' })
      } finally {
        loading.value = false
      }
    }

    return { open, messages, input, send, loading }
  }
}
</script>

<style scoped>
.chat-loading { display: flex; align-items: center; gap: 0.5rem }
</style>
