<template>
  <div>
    <button
      v-if="!open"
      type="button"
      class="fixed bottom-4 right-4 z-[1000] inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl ring-1 ring-white/70 transition hover:-translate-y-0.5 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
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

    <section v-if="open" class="fixed inset-x-3 bottom-20 z-[1000] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl sm:left-auto sm:right-4 sm:w-96">
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
        <p class="mt-2 text-xs text-slate-500">최대 300자, 관련 데이터 최대 12건만 전송합니다.</p>
        <p v-if="errorMessage" class="mt-2 text-xs font-medium text-rose-600">{{ errorMessage }}</p>
      </form>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import Spinner from './Spinner.vue'
import { sendChat } from '../services/chatApi'
import { searchChatItems, toChatContext } from '../utils/dataLoader'
import { getPosts } from '../utils/localStorage'

const MAX_QUESTION_LENGTH = 300
const MAX_CONTEXT_ITEMS = 12
const MAX_PLACE_CONTEXT_ITEMS = 8
const MAX_POST_CONTEXT_ITEMS = 4

const open = ref(false)
const messages = ref([])
const input = ref('')
const loading = ref(false)
const errorMessage = ref('')

const canSend = computed(() => !!input.value.trim() && !loading.value)

function normalizeText(value) {
  return String(value || '').toLowerCase()
}

function searchCommunityPosts(question) {
  const query = normalizeText(question)
  const tokens = query
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 2 && !['서울', '게시글', '커뮤니티', '검색', '알려줘', '추천'].includes(token))

  const postIntent = ['게시글', '커뮤니티', '후기', '질문', '글'].some((word) => query.includes(word))
  if (!postIntent && !tokens.length) return []

  return getPosts()
    .map((post) => {
      const searchable = [post.title, post.content, post.district, post.category, ...(post.tags || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      const score = tokens.reduce((total, token) => total + (searchable.includes(token) ? 1 : 0), postIntent ? 1 : 0)
      return { post, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || Number(b.post.views || 0) - Number(a.post.views || 0))
    .slice(0, MAX_POST_CONTEXT_ITEMS)
    .map(({ post }) => ({
      type: 'post',
      id: post.id,
      title: post.title,
      category: post.category,
      district: post.district,
      content: post.content,
      tags: post.tags,
      views: post.views,
      likes: post.likes,
      bookmarks: post.bookmarks
    }))
}

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
    const matched = await searchChatItems(question, { limit: MAX_PLACE_CONTEXT_ITEMS })
    const context = [
      ...toChatContext(matched, MAX_PLACE_CONTEXT_ITEMS),
      ...searchCommunityPosts(question)
    ].slice(0, MAX_CONTEXT_ITEMS)
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
