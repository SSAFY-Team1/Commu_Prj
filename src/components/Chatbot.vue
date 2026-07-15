<template>
  <div>
    <button
      type="button"
      class="fixed bottom-4 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-xl text-white shadow-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
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
          <div :class="['max-w-[82%] break-words rounded px-3 py-2 text-sm', message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-800']">
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
          <ButtonPrimary type="submit" :disabled="!canSend">전송</ButtonPrimary>
        </div>
        <p class="mt-2 text-xs text-slate-500">최대 300자, 관련 데이터 최대 5건만 전송합니다.</p>
        <p v-if="errorMessage" class="mt-2 text-xs font-medium text-rose-600">{{ errorMessage }}</p>
      </form>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import ButtonPrimary from './ButtonPrimary.vue'
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
