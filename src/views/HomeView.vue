<template>
  <div class="space-y-8">
    <section class="grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-stretch">
      <div class="rounded bg-slate-900 p-6 text-white sm:p-8">
        <p class="text-sm font-semibold text-brand-100">서울 권역 공공데이터 기반</p>
        <h1 class="mt-3 text-3xl font-bold leading-tight sm:text-4xl">LocalHub 서울</h1>
        <p class="mt-4 max-w-2xl text-slate-200">
          관광지, 문화시설, 축제, 숙박, 쇼핑 정보를 한곳에서 탐색하고 익명 커뮤니티와 챗봇으로 지역 경험을 공유하는 MVP입니다.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <router-link to="/category/all" class="rounded bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-brand-50">지역 정보 보기</router-link>
          <router-link to="/dashboard" class="rounded border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">대시보드</router-link>
          <router-link to="/community" class="rounded border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">커뮤니티</router-link>
        </div>
      </div>

      <div class="panel p-5">
        <p class="text-sm font-semibold text-slate-500">현재 데이터</p>
        <p class="mt-2 text-4xl font-bold text-slate-900">{{ totalLabel }}</p>
        <p class="mt-1 text-sm text-slate-600">한국관광공사 TourAPI 4.0 서울 JSON 기준</p>
        <div class="mt-5 grid grid-cols-2 gap-2 text-sm">
          <router-link v-for="category in categories" :key="category.name" :to="`/category/${encodeURIComponent(category.name)}`" class="rounded border border-slate-200 px-3 py-2 hover:border-brand-300 hover:bg-brand-50">
            <span class="block font-semibold text-slate-800">{{ category.name }}</span>
            <span class="text-slate-500">{{ category.count.toLocaleString() }}건</span>
          </router-link>
        </div>
      </div>
    </section>

    <section>
      <div class="mb-3 flex items-end justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900">추천 지역 정보</h2>
          <p class="text-sm text-slate-600">전체 데이터 중 일부를 먼저 보여줍니다.</p>
        </div>
        <router-link to="/category/all" class="text-sm font-semibold text-brand-700">전체 보기</router-link>
      </div>

      <div v-if="loading" class="panel p-6 text-sm text-slate-600">데이터를 불러오는 중입니다...</div>
      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article v-for="item in featuredItems" :key="item.id" class="panel overflow-hidden">
          <div class="flex h-36 items-center justify-center bg-slate-100">
            <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.title" class="h-full w-full object-cover" />
            <span v-else class="text-sm text-slate-500">이미지 없음</span>
          </div>
          <div class="p-4">
            <div class="flex items-center gap-2 text-xs font-semibold text-brand-700">
              <span>{{ item.category }}</span>
              <span class="text-slate-300">/</span>
              <span>{{ item.district }}</span>
            </div>
            <h3 class="mt-2 line-clamp-2 font-bold text-slate-900">{{ item.title }}</h3>
            <p class="mt-2 line-clamp-2 text-sm text-slate-600">{{ item.address }}</p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { aggregateByCategory, loadAllData } from '../utils/dataLoader'

const loading = ref(true)
const items = ref([])

const featuredItems = computed(() => items.value.slice(0, 6))
const totalLabel = computed(() => (loading.value ? '...' : items.value.length.toLocaleString()))
const categories = computed(() =>
  Object.entries(aggregateByCategory(items.value))
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
)

onMounted(async () => {
  items.value = await loadAllData()
  loading.value = false
})
</script>
