<template>
  <div class="space-y-6">
    <header>
      <p class="text-sm font-semibold text-brand-700">데이터 시각화</p>
      <h1 class="mt-1 text-2xl font-bold text-slate-900">서울 지역 정보 대시보드</h1>
      <p class="mt-2 text-sm text-slate-600">Team B가 고도화할 대시보드 기본 화면입니다. 현재는 전체 JSON 기준 집계를 표시합니다.</p>
    </header>

    <section class="grid gap-4 md:grid-cols-3">
      <KpiCard label="전체 콘텐츠" :value="total" />
      <KpiCard label="카테고리 수" :value="categoryCount" />
      <KpiCard label="커뮤니티 게시글" :value="postCount" />
    </section>

    <section v-if="loading" class="panel p-6 text-sm text-slate-600">데이터를 불러오는 중입니다...</section>

    <section v-else class="grid gap-4 lg:grid-cols-2">
      <div class="panel p-4">
        <h2 class="font-semibold text-slate-900">콘텐츠 유형별 건수</h2>
        <div class="mt-4 h-72">
          <canvas ref="barCanvas" aria-label="콘텐츠 유형별 건수 차트"></canvas>
        </div>
      </div>

      <div class="panel p-4">
        <h2 class="font-semibold text-slate-900">콘텐츠 유형 비율</h2>
        <div class="mt-4 h-72">
          <canvas ref="doughnutCanvas" aria-label="콘텐츠 유형 비율 차트"></canvas>
        </div>
      </div>

      <div class="panel p-4 lg:col-span-2">
        <h2 class="font-semibold text-slate-900">자치구별 콘텐츠 수 Top 10</h2>
        <div class="mt-4 h-80">
          <canvas ref="districtCanvas" aria-label="자치구별 콘텐츠 수 차트"></canvas>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Chart from 'chart.js/auto'
import KpiCard from '../components/KpiCard.vue'
import { getDashboardStats } from '../utils/dataLoader'
import { getPosts } from '../utils/localStorage'

const barCanvas = ref(null)
const doughnutCanvas = ref(null)
const districtCanvas = ref(null)
const loading = ref(true)
const total = ref('--')
const categoryCount = ref('--')
const postCount = ref('--')
const charts = []

const palette = ['#4f46e5', '#0891b2', '#16a34a', '#f59e0b', '#e11d48', '#7c3aed', '#475569']

function entriesToLabelsAndValues(entries) {
  return {
    labels: entries.map(([label]) => label),
    values: entries.map(([, value]) => value)
  }
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
      options: { responsive: true, maintainAspectRatio: false }
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
