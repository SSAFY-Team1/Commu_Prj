<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Community</h1>

    <form @submit.prevent="createPost" class="mb-4 space-y-3 rounded-lg border bg-white p-4 shadow-sm">
      <div class="grid gap-3 sm:grid-cols-2">
        <input v-model="title" placeholder="제목" class="border p-2 w-full" />
        <input v-model="category" placeholder="카테고리" class="border p-2 w-full" />
      </div>
      <textarea v-model="content" placeholder="내용" class="border p-2 w-full h-28"></textarea>
      <input v-model="password" placeholder="비밀번호(수정/삭제용)" class="border p-2 w-full" />
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded">작성</button>
        <div class="text-sm text-slate-500">카테고리, 조회수, 좋아요, 북마크가 저장됩니다.</div>
      </div>
    </form>

    <div class="mb-4">
      <input v-model="searchQuery" placeholder="제목 또는 내용 검색" class="border p-2 w-full" />
    </div>

    <div v-if="filteredPosts.length === 0" class="rounded bg-slate-50 p-4 text-sm text-slate-600">
      검색 결과가 없습니다.
    </div>

    <div v-for="p in filteredPosts" :key="p.id" class="mb-3 rounded-lg border bg-white p-4 shadow-sm">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div class="text-lg font-semibold">{{ p.title }}</div>
          <div class="text-xs text-slate-500">{{ p.category }} · {{ p.created }}</div>
        </div>
        <button @click="viewPost(p)" class="text-sm text-brand-600">상세보기</button>
      </div>

      <p class="mt-3 text-sm text-slate-700 line-clamp-3">{{ p.content }}</p>

      <div class="mt-3 flex flex-wrap gap-2 text-sm">
        <span class="rounded-full bg-slate-100 px-2 py-1">조회수 {{ p.views }}</span>
        <span class="rounded-full bg-slate-100 px-2 py-1">좋아요 {{ p.likes }}</span>
        <span class="rounded-full bg-slate-100 px-2 py-1">북마크 {{ p.bookmarks }}</span>
      </div>

      <div class="mt-3 flex flex-wrap gap-2">
        <button @click="toggleLike(p)" class="rounded border px-3 py-1 text-sm text-slate-700 hover:bg-slate-50">
          {{ p.liked ? '좋아요 취소' : '좋아요' }}
        </button>
        <button @click="toggleBookmark(p)" class="rounded border px-3 py-1 text-sm text-slate-700 hover:bg-slate-50">
          {{ p.bookmarked ? '북마크 해제' : '북마크' }}
        </button>
        <button @click="startEdit(p)" class="rounded border px-3 py-1 text-sm text-blue-600 hover:bg-blue-50">수정</button>
        <button @click="del(p)" class="rounded border px-3 py-1 text-sm text-red-600 hover:bg-red-50">삭제</button>
      </div>
    </div>

    <div v-if="editing" class="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-lg rounded bg-white p-6 shadow-lg">
        <h3 class="text-lg font-semibold mb-3">게시글 수정</h3>
        <input v-model="editTitle" placeholder="제목" class="border p-2 w-full mb-3" />
        <input v-model="editCategory" placeholder="카테고리" class="border p-2 w-full mb-3" />
        <textarea v-model="editContent" placeholder="내용" class="border p-2 w-full h-28 mb-3"></textarea>
        <input v-model="editPassword" placeholder="비밀번호" class="border p-2 w-full mb-4" />
        <div class="flex justify-end gap-2">
          <button @click="applyEdit" class="bg-indigo-600 text-white px-4 py-2 rounded">적용</button>
          <button @click="cancelEdit" class="rounded border px-4 py-2">취소</button>
        </div>
      </div>
    </div>

    <div v-if="viewingPost" class="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-xl rounded bg-white p-6 shadow-lg">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-xl font-semibold">{{ viewingPost.title }}</h3>
            <div class="text-xs text-slate-500">{{ viewingPost.category }} · {{ viewingPost.created }}</div>
          </div>
          <button @click="closeView" class="text-2xl leading-none text-slate-500">×</button>
        </div>
        <div class="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
          <span class="rounded-full bg-slate-100 px-2 py-1">조회수 {{ viewingPost.views }}</span>
          <span class="rounded-full bg-slate-100 px-2 py-1">좋아요 {{ viewingPost.likes }}</span>
          <span class="rounded-full bg-slate-100 px-2 py-1">북마크 {{ viewingPost.bookmarks }}</span>
        </div>
        <p class="mt-4 whitespace-pre-line text-slate-700">{{ viewingPost.content }}</p>
        <div class="mt-4 flex justify-end">
          <button @click="closeView" class="rounded border px-4 py-2">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { getPosts, savePost, updatePost, deletePost, incrementViews, toggleLike, toggleBookmark } from '../utils/localStorage'

export default {
  setup() {
    const title = ref('')
    const category = ref('자유')
    const content = ref('')
    const password = ref('')
    const searchQuery = ref('')
    const posts = ref([])

    const editing = ref(false)
    const editId = ref(null)
    const editTitle = ref('')
    const editCategory = ref('자유')
    const editContent = ref('')
    const editPassword = ref('')

    const viewingPost = ref(null)

    function load() {
      posts.value = getPosts()
    }

    function createPost() {
      if (!title.value || !content.value || !password.value) return alert('모든 필드를 입력하세요')
      const post = {
        id: Date.now().toString(),
        title: title.value,
        content: content.value,
        password: password.value,
        category: category.value || '자유',
        created: new Date().toLocaleString(),
        views: 0,
        likes: 0,
        bookmarks: 0,
        liked: false,
        bookmarked: false
      }
      savePost(post)
      title.value = content.value = password.value = ''
      category.value = '자유'
      load()
    }

    function startEdit(p) {
      editId.value = p.id
      editTitle.value = p.title
      editCategory.value = p.category || '자유'
      editContent.value = p.content
      editing.value = true
    }

    function applyEdit() {
      if (!editPassword.value) return alert('비밀번호를 입력하세요')
      const target = posts.value.find((x) => x.id === editId.value)
      if (!target) return
      if (target.password !== editPassword.value) return alert('비밀번호가 틀립니다')
      updatePost(editId.value, {
        title: editTitle.value,
        content: editContent.value,
        category: editCategory.value || '자유'
      })
      editing.value = false
      editPassword.value = ''
      load()
    }

    function cancelEdit() {
      editing.value = false
      editPassword.value = ''
    }

    function del(p) {
      const pw = prompt('삭제하려면 비밀번호를 입력하세요')
      if (!pw) return
      if (pw !== p.password) return alert('비밀번호가 틀립니다')
      deletePost(p.id)
      load()
    }

    function viewPost(p) {
      incrementViews(p.id)
      load()
      const updated = getPosts().find((item) => item.id === p.id)
      viewingPost.value = updated || p
    }

    function closeView() {
      viewingPost.value = null
    }

    function toggleLikePost(p) {
      toggleLike(p.id)
      load()
    }

    function toggleBookmarkPost(p) {
      toggleBookmark(p.id)
      load()
    }

    const filteredPosts = computed(() => {
      const query = String(searchQuery.value || '').trim().toLowerCase()
      if (!query) return posts.value
      return posts.value.filter((post) =>
        [post.title, post.content]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query))
      )
    })

    onMounted(load)

    return {
      title,
      category,
      content,
      password,
      searchQuery,
      posts,
      filteredPosts,
      createPost,
      startEdit,
      editing,
      editTitle,
      editCategory,
      editContent,
      editPassword,
      applyEdit,
      cancelEdit,
      del,
      viewingPost,
      viewPost,
      closeView,
      toggleLike: toggleLikePost,
      toggleBookmark: toggleBookmarkPost
    }
  }
}
</script>
