<template>
  <div class="space-y-5">
    <header class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="text-sm font-semibold text-brand-700">서울 지역 정보</p>
        <h1 class="mt-1 text-2xl font-bold text-slate-900">{{ selectedTitle }}</h1>
        <p class="mt-2 text-sm text-slate-600">제공 JSON을 기준으로 카테고리별 목록과 검색을 제공합니다.</p>
      </div>
      <div class="text-sm text-slate-500">{{ filteredItems.length.toLocaleString() }}건</div>
    </header>

    <section class="panel p-4">
      <div class="grid gap-3 md:grid-cols-[220px_1fr]">
        <label>
          <span class="mb-1 block text-sm font-semibold text-slate-700">카테고리</span>
          <select v-model="selectedCategory" class="field" @change="goCategory">
            <option value="all">전체</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </label>
        <label>
          <span class="mb-1 block text-sm font-semibold text-slate-700">검색</span>
          <input v-model="keyword" class="field" type="search" placeholder="장소명, 주소, 자치구, 전화번호 검색" />
        </label>
      </div>
    </section>

    <section v-if="loading" class="panel p-6 text-sm text-slate-600">데이터를 불러오는 중입니다...</section>
    <section v-else-if="filteredItems.length === 0" class="panel p-6 text-sm text-slate-600">검색 결과가 없습니다.</section>
    <section v-else class="grid gap-4 md:grid-cols-2">
      <article v-for="item in pagedItems" :key="item.id" class="panel grid grid-cols-[96px_1fr] overflow-hidden">
        <div class="flex min-h-28 items-center justify-center bg-slate-100">
          <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.title" class="h-full w-full object-cover" />
          <span v-else class="text-xs text-slate-500">이미지 없음</span>
        </div>
        <div class="p-4">
          <div class="flex flex-wrap gap-2 text-xs font-semibold">
            <span class="rounded bg-brand-50 px-2 py-1 text-brand-700">{{ item.category }}</span>
            <span class="rounded bg-slate-100 px-2 py-1 text-slate-600">{{ item.district }}</span>
          </div>
          <h2 class="mt-2 font-bold text-slate-900">{{ item.title }}</h2>
          <p class="mt-1 text-sm text-slate-600">{{ item.address }}</p>
          <p class="mt-2 text-xs text-slate-500">{{ item.tel }}</p>
        </div>
      </article>
    </section>

    <div v-if="filteredItems.length > pageSize" class="flex justify-center">
      <ButtonPrimary variant="secondary" @click="pageSize += 20">더 보기</ButtonPrimary>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ButtonPrimary from '../components/ButtonPrimary.vue'
import { loadAllData } from '../utils/dataLoader'

const props = defineProps({
  id: { type: String, default: 'all' }
})

const router = useRouter()
const loading = ref(true)
const items = ref([])
const keyword = ref('')
const pageSize = ref(20)
const selectedCategory = ref(decodeURIComponent(props.id || 'all'))

const categories = computed(() => Array.from(new Set(items.value.map((item) => item.category))).sort())
const selectedTitle = computed(() => (selectedCategory.value === 'all' ? '전체 카테고리' : selectedCategory.value))

const filteredItems = computed(() => {
  const query = keyword.value.trim().toLowerCase()
  return items.value.filter((item) => {
    const categoryMatched = selectedCategory.value === 'all' || item.category === selectedCategory.value
    const keywordMatched =
      !query ||
      [item.title, item.address, item.tel, item.district, item.category]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    return categoryMatched && keywordMatched
  })
})

const pagedItems = computed(() => filteredItems.value.slice(0, pageSize.value))

function goCategory() {
  router.push(`/category/${encodeURIComponent(selectedCategory.value)}`)
}

watch(
  () => props.id,
  (value) => {
    selectedCategory.value = decodeURIComponent(value || 'all')
    pageSize.value = 20
  }
)

watch(keyword, () => {
  pageSize.value = 20
})

onMounted(async () => {
  items.value = await loadAllData()
  loading.value = false
})
</script>
