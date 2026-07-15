<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Community</h1>

    <form @submit.prevent="createPost" class="mb-4">
      <input v-model="title" placeholder="제목" class="border p-2 w-full mb-2" />
      <input v-model="password" placeholder="비밀번호(수정/삭제용)" class="border p-2 w-full mb-2" />
      <textarea v-model="content" placeholder="내용" class="border p-2 w-full mb-2"></textarea>
      <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded">작성</button>
    </form>

    <div v-for="p in posts" :key="p.id" class="mb-2 p-3 bg-white rounded shadow">
      <div class="flex justify-between">
        <div>{{ p.title }}</div>
        <div class="text-sm text-gray-500">{{ p.created }}</div>
      </div>
      <div class="mt-2">{{ p.content }}</div>
      <div class="mt-2 space-x-2">
        <button @click="startEdit(p)" class="text-sm text-blue-600">수정</button>
        <button @click="del(p)" class="text-sm text-red-600">삭제</button>
      </div>
    </div>

    <div v-if="editing" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div class="bg-white p-4 rounded w-96">
        <h3 class="mb-2">수정</h3>
        <input v-model="editTitle" class="border p-2 w-full mb-2" />
        <textarea v-model="editContent" class="border p-2 w-full mb-2"></textarea>
        <input v-model="editPassword" placeholder="비밀번호" class="border p-2 w-full mb-2" />
        <div class="flex justify-end space-x-2">
          <button @click="applyEdit" class="bg-indigo-600 text-white px-3 py-1 rounded">적용</button>
          <button @click="cancelEdit" class="px-3 py-1">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getPosts, savePost, updatePost, deletePost } from '../utils/localStorage'

export default {
  setup() {
    const title = ref('')
    const content = ref('')
    const password = ref('')
    const posts = ref([])

    const editing = ref(false)
    const editId = ref(null)
    const editTitle = ref('')
    const editContent = ref('')
    const editPassword = ref('')

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
        created: new Date().toLocaleString()
      }
      savePost(post)
      title.value = content.value = password.value = ''
      load()
    }

    function startEdit(p) {
      editId.value = p.id
      editTitle.value = p.title
      editContent.value = p.content
      editing.value = true
    }

    function applyEdit() {
      if (!editPassword.value) return alert('비밀번호를 입력하세요')
      const target = posts.value.find(x => x.id === editId.value)
      if (!target) return
      if (target.password !== editPassword.value) return alert('비밀번호가 틀립니다')
      updatePost(editId.value, { title: editTitle.value, content: editContent.value })
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

    onMounted(load)

    return { title, content, password, posts, createPost, startEdit, editing, editTitle, editContent, editPassword, applyEdit, cancelEdit, del }
  }
}
</script>
