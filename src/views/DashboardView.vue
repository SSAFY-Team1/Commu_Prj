<template>
  <div class="p-4 md:p-6 space-y-6">

    <section class="grid grid-cols-3 gap-2 md:gap-4">
      <KpiCard label="전체 콘텐츠" :value="total" />
      <KpiCard label="카테고리 수" :value="categoryCount" />
      <KpiCard label="커뮤니티 게시글" :value="postCount" />
    </section>

    <section class="grid grid-cols-[45%_55%] gap-6">
    
      <div class="panel p-4">
        <h2 class="font-semibold text-slate-900 mb-4">콘텐츠 카테고리 비율</h2>
        <div class="h-[260px] flex justify-center items-center">
          <canvas ref="doughnutCanvas"></canvas>
        </div>
      </div>

      <div class="lg:col-span-2 grid grid-cols-1 gap-6">
        
        <div class="panel p-4">
          <h2 class="font-semibold text-slate-900 mb-4">콘텐츠 카테고리별 건수</h2>
          <div class="h-36">
            <canvas ref="barCanvas"></canvas>
          </div>
        </div>
        
        <div class="panel p-4">
          <h2 class="font-semibold text-slate-900 mb-4">콘텐츠 수 Top 10 자치구</h2>
          <div class="h-40">
            <canvas ref="districtCanvas"></canvas>
          </div>
        </div>
        
      </div>
    </section>

    <section class="space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-slate-900">추천 정보</h2>
          <p class="text-sm text-slate-600">파이차트에서 카테고리를 클릭하면 해당 카테고리의 추천 지역 5개를 보여줍니다.</p>
        </div>
        <p class="text-sm text-slate-500">선택된 카테고리: <span class="font-semibold">{{ selectedCategory || '없음' }}</span></p>
      </div>

      <div v-if="!selectedCategory" class="panel p-4 text-sm text-slate-600">
        파이 차트에서 카테고리를 클릭해 추천 지역을 확인하세요.
      </div>

      <div v-else class="grid gap-3 grid-cols-5">
        <article v-for="item in recommendedItems" :key="item.id" class="panel overflow-hidden min-w-0">
          <div class="flex h-24 items-center justify-center bg-slate-100">
            <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.title" class="h-full w-full object-cover" />
            <span v-else class="text-xs text-slate-500">이미지 없음</span>
          </div>
          <div class="p-3">
            <div class="flex items-center gap-2 text-[11px] font-semibold text-brand-700">
              <span>{{ item.category }}</span>
              <span class="text-slate-300">/</span>
              <span>{{ item.district }}</span>
            </div>
            <h3 class="mt-2 line-clamp-2 font-bold text-slate-900 text-sm">{{ item.title }}</h3>
            <p class="mt-2 line-clamp-2 text-xs text-slate-600">{{ item.address }}</p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Chart from 'chart.js/auto'
import KpiCard from '../components/KpiCard.vue'
import { getDashboardStats, getByCategory } from '../utils/dataLoader'
import { getPosts } from '../utils/localStorage'

const barCanvas = ref(null)
const doughnutCanvas = ref(null)
const districtCanvas = ref(null)
const loading = ref(true)
const total = ref('--')
const categoryCount = ref('--')
const postCount = ref('--')
const selectedCategory = ref('')
const recommendedItems = ref([])
const charts = []

const palette = ['#4f46e5', '#0891b2', '#16a34a', '#f59e0b', '#e11d48', '#7c3aed', '#475569']

function entriesToLabelsAndValues(entries) {
  return {
    labels: entries.map(([label]) => label),
    values: entries.map(([, value]) => value)
  }
}

function shuffleArray(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

async function loadRecommended(category) {
  selectedCategory.value = category
  recommendedItems.value = []
  const items = await getByCategory(category)
  recommendedItems.value = shuffleArray(items).slice(0, 5)
}

function createCharts(stats) {
  const categoryEntries = Object.entries(stats.categoryCounts).sort((a, b) => b[1] - a[1])
  const districtEntries = Object.entries(stats.districtCounts)
    .filter(([district]) => district !== '미분류')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  const categoryData = entriesToLabelsAndValues(categoryEntries)
  const districtData = entriesToLabelsAndValues(districtEntries)

  charts.push(
    new Chart(barCanvas.value, {
      type: 'bar',
      data: {
        labels: categoryData.labels,
        datasets: [{ label: '건수', data: categoryData.values, backgroundColor: palette[0] }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    })
  )

  charts.push(
    new Chart(doughnutCanvas.value, {
      type: 'doughnut',
      data: {
        labels: categoryData.labels,
        datasets: [{ data: categoryData.values, backgroundColor: palette }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick(evt, elements) {
          if (!elements.length) return
          const index = elements[0].index
          const category = this.data.labels[index]
          loadRecommended(category)
        }
      }
    })
  )

  charts.push(
    new Chart(districtCanvas.value, {
      type: 'bar',
      data: {
        labels: districtData.labels,
        datasets: [{ label: '건수', data: districtData.values, backgroundColor: palette[1] }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false
      }
    })
  )
}

onMounted(async () => {
  const stats = await getDashboardStats()
  total.value = stats.total.toLocaleString()
  categoryCount.value = stats.categories.length
  postCount.value = getPosts().length
  loading.value = false

  requestAnimationFrame(() => createCharts(stats))
})

onBeforeUnmount(() => {
  charts.forEach((chart) => chart.destroy())
})
</script>
