<template>
  <div>
    <button
      type="button"
      class="fixed bottom-4 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-xl text-white shadow-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2"
      aria-label="챗봇 열기"
      @click="open = true"
    >
      ?
    </button>

    <section v-if="open" class="fixed inset-x-3 bottom-20 z-50 rounded border border-slate-200 bg-white shadow-xl sm:left-auto sm:right-4 sm:w-96">
      <header class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <h2 class="font-bold text-slate-900">LocalHub 챗봇</h2>
          <p class="text-xs text-slate-500">제공 데이터 기준으로 답변합니다.</p>
        </div>
        <button type="button" class="rounded px-2 text-xl text-slate-500 hover:bg-slate-100" aria-label="챗봇 닫기" @click="open = false">×</button>
      </header>

      <div class="h-80 space-y-3 overflow-y-auto px-4 py-3">
        <div v-if="messages.length === 0" class="rounded bg-slate-50 p-3 text-sm text-slate-600">
          예: "종로구 관광지 추천해줘", "서울 축제 알려줘"
        </div>

        <div v-for="(message, index) in messages" :key="index" :class="message.role === 'user' ? 'flex justify-end' : 'flex justify-start'">
          <div :class="['max-w-[82%] rounded px-3 py-2 text-sm', message.role === 'user' ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-800']">
            {{ message.text }}
          </div>
        </div>

        <div v-if="loading" class="flex items-center gap-2 text-sm text-slate-500">
          <Spinner />
          답변을 생성하는 중입니다...
        </div>
      </div>

      <form class="border-t border-slate-200 p-3" @submit.prevent="send">
        <label class="sr-only" for="chat-question">질문</label>
        <div class="flex gap-2">
          <input
            id="chat-question"
            v-model="input"
            class="field"
            maxlength="300"
            placeholder="질문을 입력하세요"
            :disabled="loading"
          />
          <ButtonPrimary :disabled="loading || !input.trim()" @click="send">전송</ButtonPrimary>
        </div>
        <p class="mt-2 text-xs text-slate-500">최대 300자, 관련 데이터 최대 5건만 전송합니다.</p>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ButtonPrimary from './ButtonPrimary.vue'
import Spinner from './Spinner.vue'
import { sendChat } from '../services/chatApi'
import { searchItems, toChatContext } from '../utils/dataLoader'

const open = ref(false)
const messages = ref([])
const input = ref('')
const loading = ref(false)

async function send() {
  const question = input.value.trim()
  if (!question || loading.value) return

  messages.value.push({ role: 'user', text: question })
  input.value = ''
  loading.value = true

  try {
    const matched = await searchItems(question)
    const context = toChatContext(matched, 5)
    const response = await sendChat(question, context)
    messages.value.push({ role: 'bot', text: response.answer || '응답을 찾지 못했습니다.' })
  } catch (error) {
    messages.value.push({ role: 'bot', text: '챗봇 응답 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' })
  } finally {
    loading.value = false
  }
}
</script>
