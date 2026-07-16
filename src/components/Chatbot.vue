<template>
  <div>
    <button
      v-if="!open"
      type="button"
      class="fixed bottom-4 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl ring-1 ring-white/70 transition hover:-translate-y-0.5 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
      aria-label="챗봇 열기"
      @click="open = true"
    >
      <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <rect x="4" y="7" width="16" height="10" rx="3" />
        <path d="M8 11h.01" />
        <path d="M16 11h.01" />
        <path d="M9 16h6" />
        <path d="M9 4v3" />
        <path d="M15 4v3" />
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
          <div :class="['max-w-[82%] break-words rounded-lg px-3 py-2 text-sm shadow-sm', message.role === 'user' ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-800']">
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
import { getByCategory, searchItems, toChatContext } from '../utils/dataLoader'

const MAX_QUESTION_LENGTH = 300
const MAX_CONTEXT_ITEMS = 5

const SEOUL_DISTRICTS = [
  '종로구',
  '중구',
  '용산구',
  '성동구',
  '광진구',
  '동대문구',
  '중랑구',
  '성북구',
  '강북구',
  '도봉구',
  '노원구',
  '은평구',
  '서대문구',
  '마포구',
  '양천구',
  '강서구',
  '구로구',
  '금천구',
  '영등포구',
  '동작구',
  '관악구',
  '서초구',
  '강남구',
  '송파구',
  '강동구'
]

const CATEGORY_LABELS = [
  '관광지',
  '문화시설',
  '축제공연행사',
  '여행코스',
  '레포츠',
  '숙박',
  '쇼핑'
]

function extractDistrict(question) {
  const lower = question.toLowerCase()
  return SEOUL_DISTRICTS.find((district) => lower.includes(district.toLowerCase())) || null
}

function extractCategory(question) {
  const lower = question.toLowerCase()
  return CATEGORY_LABELS.find((label) => lower.includes(label.toLowerCase())) || null
}

function cleanQuestionForSearch(question) {
  return String(question || '')
    .replace(/추천해줘|알려줘|어디|좀|해줘|주세요|줘|찾아줘/gi, ' ')
    .replace(/[^가-힣0-9a-zA-Z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

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
    const district = extractDistrict(question)
    const category = extractCategory(question)
    let matched = []

    if (district) {
      matched = await searchItems(district)
    } else if (category) {
      matched = await getByCategory(category)
    } else {
      const cleaned = cleanQuestionForSearch(question)
      matched = cleaned ? await searchItems(cleaned) : []
    }

    console.log('검색어:', question, '/ 매칭 건수:', matched.length)

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
