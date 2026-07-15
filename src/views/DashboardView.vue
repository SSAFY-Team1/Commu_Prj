<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    <p class="mb-4">데이터 시각화 및 KPI</p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KpiCard label="전체 콘텐츠" :value="total" />
      <KpiCard label="카테고리 수" :value="categoryCount" />
      <KpiCard label="샘플 게시글" :value="postCount" />
    </div>

    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-4 bg-white rounded shadow">
        <h3 class="mb-2 font-semibold">콘텐츠 유형별 건수</h3>
        <canvas ref="barCanvas" class="w-full h-64"></canvas>
      </div>

      <div class="p-4 bg-white rounded shadow">
        <h3 class="mb-2 font-semibold">카테고리 비율</h3>
        <canvas ref="doughnutCanvas" class="w-full h-64"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { loadSampleData } from '../utils/dataLoader'
import { getPosts } from '../utils/localStorage'
import Chart from 'chart.js/auto'
import KpiCard from '../components/KpiCard.vue'

const barCanvas = ref(null)
const doughnutCanvas = ref(null)
let charts = []

  const total = ref('--')
const categoryCount = ref('--')
const postCount = ref('--')

function groupByCategory(items) {
  const map = new Map()
  items.forEach(i => {
    const k = i.category || '알수없음'
    map.set(k, (map.get(k) || 0) + 1)
  })
  return map
}

onMounted(async () => {
  const data = await loadSampleData()
  total.value = data.length
  // 게시글 수는 localStorage 기준
  postCount.value = getPosts().length
  const map = groupByCategory(data)
  categoryCount.value = map.size

  const labels = Array.from(map.keys())
  const values = Array.from(map.values())

  if (barCanvas.value) {
    const ctx = barCanvas.value.getContext('2d')
    charts.push(new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ label: '건수', data: values, backgroundColor: '#6366f1' }] },
      options: { responsive: true, maintainAspectRatio: false }
    }))
  }

  if (doughnutCanvas.value) {
    const ctx2 = doughnutCanvas.value.getContext('2d')
    charts.push(new Chart(ctx2, {
      type: 'doughnut',
      data: { labels, datasets: [{ data: values, backgroundColor: ['#6366f1','#ef4444','#10b981','#f59e0b','#8b5cf6'] }] },
      options: { responsive: true, maintainAspectRatio: false }
    }))
  }
})

onBeforeUnmount(() => { charts.forEach(c => c.destroy()) })
</script>
