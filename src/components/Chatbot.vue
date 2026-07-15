<template>
  <div>
    <button
      v-if="!open"
      type="button"
      class="fixed bottom-4 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-xl shadow-brand-600/30 ring-1 ring-white/70 transition hover:-translate-y-0.5 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2"
      aria-label="챗봇 열기"
      @click="open = true"
    >
      <svg class="h-7 w-7" viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false">
        <path d="M6 6.5h16a3 3 0 0 1 3 3v7.75a3 3 0 0 1-3 3h-8.25L8.5 24v-3.75H6a3 3 0 0 1-3-3V9.5a3 3 0 0 1 3-3Z" fill="currentColor" />
        <circle cx="10" cy="13.5" r="1.35" fill="#2563EB" />
        <circle cx="14" cy="13.5" r="1.35" fill="#2563EB" />
        <circle cx="18" cy="13.5" r="1.35" fill="#2563EB" />
      </svg>
    </button>

    <section v-if="open" class="fixed inset-x-3 bottom-20 z-50 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl sm:left-auto sm:right-4 sm:w-96">
      <header class="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
        <div>
          <h2 class="font-bold">LocalHub 챗봇</h2>
          <p class="text-xs text-slate-300">제공 데이터 기준으로 답변합니다.</p>
        </div>
        <button type="button" class="rounded px-2 text-xl leading-none text-slate-200 hover:bg-white/10 hover:text-white" aria-label="챗봇 닫기" @click="open = false">×</button>
      </header>

      <div class="h-80 space-y-3 overflow-y-auto bg-slate-50 px-4 py-3">
        <div v-if="messages.length === 0" class="rounded border border-slate-200 bg-white p-3 text-sm text-slate-600">
          예: "종로구 관광지 추천해줘", "서울 축제 알려줘"
        </div>

        <div v-for="(message, index) in messages" :key="index" :class="message.role === 'user' ? 'flex justify-end' : 'flex justify-start'">
          <div :class="['max-w-[82%] break-words rounded-lg px-3 py-2 text-sm shadow-sm', message.role === 'user' ? 'bg-brand-500 text-white' : 'border border-slate-200 bg-white text-slate-800']">
            {{ message.text }}
          </div>
        </div>

        <div v-if="loading" class="flex items-center gap-2 text-sm text-slate-500">
          <Spinner />
          답변을 생성하는 중입니다...
        </div>
      </div>

      <form class="border-t border-slate-200 bg-white p-3" @submit.prevent="send">
        <label class="sr-only" for="chat-question">질문</label>
        <div class="flex gap-2">
          <input
            id="chat-question"
            v-model="input"
            class="field min-w-0 flex-1"
            maxlength="300"
            placeholder="질문을 입력하세요"
            :disabled="loading"
          />
          <button
            type="submit"
            :disabled="!canSend"
            class="inline-flex min-w-16 items-center justify-center rounded bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:border disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
          >
            전송
          </button>
        </div>
        <p class="mt-2 text-xs text-slate-500">최대 300자, 관련 데이터 최대 5건만 전송합니다.</p>
        <p v-if="errorMessage" class="mt-2 text-xs font-medium text-rose-600">{{ errorMessage }}</p>
      </form>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import Spinner from './Spinner.vue'
import { sendChat } from '../services/chatApi'
import { searchItems, toChatContext } from '../utils/dataLoader'

const MAX_QUESTION_LENGTH = 300
const MAX_CONTEXT_ITEMS = 5

const open = ref(false)
const messages = ref([])
const input = ref('')
const loading = ref(false)
const errorMessage = ref('')

const canSend = computed(() => !!input.value.trim() && !loading.value)

async function send() {
  const question = String(input.value || '').trim()
  if (loading.value) return

  if (!question) {
    errorMessage.value = '질문을 입력하세요.'
    return
  }

  if (question.length > MAX_QUESTION_LENGTH) {
    errorMessage.value = `질문은 ${MAX_QUESTION_LENGTH}자 이내로 입력해 주세요.`
    return
  }

  errorMessage.value = ''
  messages.value.push({ role: 'user', text: question })
  input.value = ''
  loading.value = true

  try {
    const matched = await searchItems(question)
    const context = toChatContext(matched, MAX_CONTEXT_ITEMS)
    const response = await sendChat(question, context)
    messages.value.push({ role: 'bot', text: response.answer || '제공된 데이터에서 답변을 찾을 수 없습니다.' })
  } catch (error) {
    const userMessage = error?.message || '챗봇 응답 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
    messages.value.push({ role: 'bot', text: userMessage })
    errorMessage.value = '오류가 발생했습니다. 다시 전송해 주세요.'
  } finally {
    loading.value = false
  }
}
</script>
