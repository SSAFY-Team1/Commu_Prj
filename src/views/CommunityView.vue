<template>
  <div class="space-y-5">
    <header class="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-xs text-slate-500">홈 &gt; 서울/경기 게시판</p>
        <h1 class="mt-2 text-2xl font-bold text-slate-900">지역 커뮤니티 게시판</h1>
      </div>
      <button
        v-if="mode === 'list'"
        type="button"
        class="inline-flex items-center justify-center rounded border border-brand-500 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
        @click="openCreate"
      >
        + 글쓰기
      </button>
    </header>

    <section v-if="mode === 'list'" class="space-y-4">
      <div class="grid gap-2 sm:grid-cols-[1fr_auto]">
        <label class="sr-only" for="community-search">게시글 검색</label>
        <input
          id="community-search"
          v-model="searchQuery"
          class="field"
          type="search"
          placeholder="게시글 검색어를 입력하세요"
        />
        <button type="button" class="rounded border border-slate-900 px-6 py-2 text-sm font-semibold text-slate-900">
          검색
        </button>
      </div>

      <div class="overflow-hidden border border-slate-300 bg-white">
        <table class="w-full table-fixed text-sm">
          <thead class="border-b border-slate-900 bg-slate-50 text-slate-800">
            <tr>
              <th class="w-16 px-3 py-3 text-center font-semibold">번호</th>
              <th class="px-3 py-3 text-left font-semibold">제목</th>
              <th class="hidden w-24 px-3 py-3 text-center font-semibold md:table-cell">태그</th>
              <th class="w-20 px-3 py-3 text-center font-semibold">조회</th>
              <th class="hidden w-20 px-3 py-3 text-center font-semibold sm:table-cell">좋아요</th>
              <th class="w-28 px-3 py-3 text-center font-semibold">작성일</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-if="pagedPosts.length === 0">
              <td colspan="6" class="px-4 py-10 text-center text-slate-500">게시글이 없습니다.</td>
            </tr>
            <tr v-for="(post, index) in pagedPosts" :key="post.id" class="hover:bg-slate-50">
              <td class="px-3 py-3 text-center text-slate-500">{{ rowNumber(index) }}</td>
              <td class="min-w-0 px-3 py-3">
                <button type="button" class="block max-w-full truncate text-left font-semibold text-slate-900 hover:text-brand-700" @click="openDetail(post)">
                  {{ post.title }}
                </button>
                <div class="mt-1 flex flex-wrap items-center gap-1 text-xs text-slate-500">
                  <span>{{ post.category }}</span>
                  <span v-if="post.imageName">이미지</span>
                  <span v-if="post.bookmarked">북마크됨</span>
                </div>
              </td>
              <td class="hidden px-3 py-3 text-center md:table-cell">
                <span v-if="post.tags.length" class="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">#{{ post.tags[0] }}</span>
                <span v-else class="text-slate-400">-</span>
              </td>
              <td class="px-3 py-3 text-center text-slate-700">{{ post.views }}</td>
              <td class="hidden px-3 py-3 text-center text-slate-700 sm:table-cell">{{ post.likes }}</td>
              <td class="px-3 py-3 text-center text-xs text-slate-500">{{ formatDate(post.created) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="totalPages > 1" class="flex justify-center gap-1">
        <button type="button" class="pager" :disabled="currentPage === 1" @click="currentPage -= 1">&lt;</button>
        <button
          v-for="page in totalPages"
          :key="page"
          type="button"
          :class="['pager', page === currentPage ? 'border-brand-500 text-brand-700' : '']"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
        <button type="button" class="pager" :disabled="currentPage === totalPages" @click="currentPage += 1">&gt;</button>
      </div>
    </section>

    <article v-else-if="mode === 'detail' && selectedPost" class="space-y-5">
      <section class="border-b border-slate-200 pb-5">
        <p class="text-xs text-slate-500">홈 &gt; 서울/경기 게시판 &gt; 게시글 상세</p>
        <h2 class="mt-3 text-2xl font-bold text-slate-900">{{ selectedPost.title }}</h2>
        <div class="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
          <span>작성일: {{ selectedPost.created }}</span>
          <span>조회수 {{ selectedPost.views }}</span>
          <span>좋아요 {{ selectedPost.likes }}</span>
          <span>북마크 {{ selectedPost.bookmarks }}</span>
        </div>
        <div v-if="selectedPost.tags.length" class="mt-3 flex flex-wrap gap-2">
          <span v-for="tag in selectedPost.tags" :key="tag" class="rounded bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">#{{ tag }}</span>
        </div>
      </section>

      <img v-if="selectedPost.image" :src="selectedPost.image" :alt="selectedPost.imageName || selectedPost.title" class="max-h-80 w-full rounded border border-slate-200 object-contain" />
      <p class="min-h-52 whitespace-pre-line border-b border-slate-200 pb-8 leading-7 text-slate-800">{{ selectedPost.content }}</p>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" class="rounded border border-slate-900 px-5 py-2 text-sm font-semibold text-slate-900" @click="goList">목록으로</button>
        <div class="flex flex-wrap gap-2">
          <button type="button" class="rounded border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="toggleLikePost(selectedPost)">
            {{ selectedPost.liked ? '좋아요 취소' : '좋아요' }}
          </button>
          <button type="button" class="rounded border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="toggleBookmarkPost(selectedPost)">
            {{ selectedPost.bookmarked ? '북마크 해제' : '북마크' }}
          </button>
          <button type="button" class="rounded border border-slate-900 px-5 py-2 text-sm font-semibold text-slate-900" @click="askPassword('edit', selectedPost)">수정</button>
          <button type="button" class="rounded border border-rose-500 px-5 py-2 text-sm font-semibold text-rose-600" @click="askPassword('delete', selectedPost)">삭제</button>
        </div>
      </div>
    </article>

    <section v-else class="space-y-4">
      <p class="text-xs text-slate-500">홈 &gt; 서울/경기 게시판 &gt; {{ editingId ? '게시글 수정' : '글쓰기' }}</p>
      <form class="space-y-4" @submit.prevent="submitPost">
        <label class="block">
          <span class="mb-1 block text-sm font-semibold text-slate-800">제목</span>
          <input v-model="form.title" class="field" placeholder="제목을 입력하세요" />
        </label>

        <label class="block">
          <span class="mb-1 block text-sm font-semibold text-slate-800">내용</span>
          <textarea v-model="form.content" class="field min-h-64 resize-y" placeholder="내용을 입력하세요"></textarea>
        </label>

        <div class="grid gap-4 md:grid-cols-2">
          <label class="block">
            <span class="mb-1 block text-sm font-semibold text-slate-800">카테고리</span>
            <input v-model="form.category" class="field" placeholder="자유" />
          </label>
          <label class="block">
            <span class="mb-1 block text-sm font-semibold text-slate-800">태그</span>
            <input v-model="form.tagsText" class="field" placeholder="예: 맛집, 축제, 산책" />
          </label>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <label class="block">
            <span class="mb-1 block text-sm font-semibold text-slate-800">이미지 첨부</span>
            <input class="field file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-sm file:font-semibold" type="file" accept="image/*" @change="handleImage" />
            <span class="mt-1 block text-xs text-slate-500">localStorage 용량을 고려해 작은 이미지를 권장합니다.</span>
          </label>
          <label class="block">
            <span class="mb-1 block text-sm font-semibold text-slate-800">수정용 비밀번호</span>
            <input v-model="form.password" class="field" type="password" placeholder="숫자 4자리 이상" />
          </label>
        </div>

        <div v-if="form.image" class="rounded border border-slate-200 p-3">
          <div class="mb-2 flex items-center justify-between text-sm">
            <span class="font-semibold text-slate-700">{{ form.imageName }}</span>
            <button type="button" class="text-rose-600" @click="clearImage">이미지 제거</button>
          </div>
          <img :src="form.image" :alt="form.imageName" class="max-h-52 w-full object-contain" />
        </div>

        <div class="flex justify-end gap-3 pt-3">
          <button type="submit" class="rounded border border-brand-500 px-10 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50">등록</button>
          <button type="button" class="rounded border border-slate-300 px-10 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="cancelForm">취소</button>
        </div>
      </form>
    </section>

    <div v-if="passwordModal.open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-sm border border-slate-900 bg-white p-5 shadow-xl">
        <h3 class="text-center font-bold text-slate-900">비밀번호 확인</h3>
        <input
          v-model="passwordModal.value"
          class="field mt-4"
          type="password"
          placeholder="비밀번호 입력"
          @keyup.enter="confirmPassword"
        />
        <p v-if="passwordModal.error" class="mt-2 text-sm text-rose-600">{{ passwordModal.error }}</p>
        <div class="mt-4 grid grid-cols-2 gap-2">
          <button type="button" class="rounded border border-brand-500 px-4 py-2 text-sm font-semibold text-brand-700" @click="confirmPassword">확인</button>
          <button type="button" class="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700" @click="closePasswordModal">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import {
  deletePost,
  getPosts,
  incrementViews,
  savePost,
  toggleBookmark,
  toggleLike,
  updatePost
} from '../utils/localStorage'

const PAGE_SIZE = 7

const mode = ref('list')
const posts = ref([])
const selectedId = ref(null)
const editingId = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)

const form = reactive({
  title: '',
  content: '',
  password: '',
  category: '자유',
  tagsText: '',
  image: '',
  imageName: ''
})

const passwordModal = reactive({
  open: false,
  action: '',
  postId: '',
  value: '',
  error: ''
})

const filteredPosts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return posts.value

  return posts.value.filter((post) =>
    [post.title, post.content, post.category, ...(post.tags || [])]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / PAGE_SIZE)))
const pagedPosts = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredPosts.value.slice(start, start + PAGE_SIZE)
})
const selectedPost = computed(() => posts.value.find((post) => post.id === selectedId.value) || null)

watch(searchQuery, () => {
  currentPage.value = 1
})

function load() {
  posts.value = getPosts()
}

function rowNumber(index) {
  return filteredPosts.value.length - ((currentPage.value - 1) * PAGE_SIZE + index)
}

function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value || '').slice(0, 10)
  return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

function openDetail(post) {
  incrementViews(post.id)
  load()
  selectedId.value = post.id
  mode.value = 'detail'
}

function openCreate() {
  resetForm()
  editingId.value = null
  mode.value = 'form'
}

function openEdit(post) {
  editingId.value = post.id
  form.title = post.title
  form.content = post.content
  form.password = ''
  form.category = post.category || '자유'
  form.tagsText = (post.tags || []).join(', ')
  form.image = post.image || ''
  form.imageName = post.imageName || ''
  mode.value = 'form'
}

function submitPost() {
  if (!form.title.trim() || !form.content.trim() || !form.password.trim()) {
    alert('제목, 내용, 비밀번호를 입력하세요.')
    return
  }
  if (form.password.trim().length < 4) {
    alert('비밀번호는 4자리 이상 입력하세요.')
    return
  }

  const payload = {
    title: form.title.trim(),
    content: form.content.trim(),
    password: form.password.trim(),
    category: form.category.trim() || '자유',
    tags: form.tagsText,
    image: form.image,
    imageName: form.imageName
  }

  if (editingId.value) {
    updatePost(editingId.value, payload)
    selectedId.value = editingId.value
    load()
    mode.value = 'detail'
  } else {
    savePost({
      id: Date.now().toString(),
      created: new Date().toLocaleString(),
      views: 0,
      likes: 0,
      bookmarks: 0,
      liked: false,
      bookmarked: false,
      ...payload
    })
    load()
    mode.value = 'list'
  }

  resetForm()
}

function cancelForm() {
  resetForm()
  mode.value = editingId.value ? 'detail' : 'list'
  editingId.value = null
}

function resetForm() {
  form.title = ''
  form.content = ''
  form.password = ''
  form.category = '자유'
  form.tagsText = ''
  form.image = ''
  form.imageName = ''
}

function askPassword(action, post) {
  passwordModal.open = true
  passwordModal.action = action
  passwordModal.postId = post.id
  passwordModal.value = ''
  passwordModal.error = ''
}

function confirmPassword() {
  const post = posts.value.find((item) => item.id === passwordModal.postId)
  if (!post) {
    closePasswordModal()
    return
  }
  if (post.password !== passwordModal.value) {
    passwordModal.error = '비밀번호가 일치하지 않습니다.'
    return
  }

  const action = passwordModal.action
  closePasswordModal()

  if (action === 'edit') {
    openEdit(post)
  } else if (action === 'delete') {
    deletePost(post.id)
    load()
    goList()
  }
}

function closePasswordModal() {
  passwordModal.open = false
  passwordModal.action = ''
  passwordModal.postId = ''
  passwordModal.value = ''
  passwordModal.error = ''
}

function toggleLikePost(post) {
  toggleLike(post.id)
  load()
}

function toggleBookmarkPost(post) {
  toggleBookmark(post.id)
  load()
}

function handleImage(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    alert('이미지 파일만 첨부할 수 있습니다.')
    event.target.value = ''
    return
  }
  if (file.size > 700 * 1024) {
    alert('이미지는 700KB 이하 파일을 권장합니다.')
  }

  const reader = new FileReader()
  reader.onload = () => {
    form.image = String(reader.result || '')
    form.imageName = file.name
  }
  reader.readAsDataURL(file)
}

function clearImage() {
  form.image = ''
  form.imageName = ''
}

function goList() {
  selectedId.value = null
  editingId.value = null
  mode.value = 'list'
}

onMounted(load)
</script>
