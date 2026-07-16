<template>
  <div class="space-y-6 p-4 md:p-6">
    <section class="grid grid-cols-2 gap-3 md:grid-cols-4">
      <KpiCard label="전체 콘텐츠" :value="total" />
      <KpiCard label="카테고리 수" :value="categoryCount" />
      <KpiCard label="커뮤니티 게시글" :value="postCount" />
      <KpiCard label="인기 권역" :value="topRegion" />
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <div class="panel p-4">
        <h2 class="mb-4 font-semibold text-slate-900">콘텐츠 유형별 비율</h2>
        <div class="h-[280px]">
          <canvas ref="categoryCanvas"></canvas>
        </div>
      </div>

      <div class="panel p-4">
        <h2 class="mb-4 font-semibold text-slate-900">자치구별 콘텐츠 분포 Top 10</h2>
        <div class="h-[280px]">
          <canvas ref="districtCanvas"></canvas>
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <div class="panel p-4">
        <h2 class="mb-2 font-semibold text-slate-900">권역별 게시글 현황</h2>
        <p class="mb-4 text-sm text-slate-600">커뮤니티 게시글의 권역 값을 기준으로 집계합니다.</p>
        <div class="h-[260px]">
          <canvas ref="postRegionCanvas"></canvas>
        </div>
      </div>

      <div class="panel p-4">
        <h2 class="mb-2 font-semibold text-slate-900">인기 지역 통계</h2>
        <p class="mb-4 text-sm text-slate-600">조회수, 좋아요, 북마크를 합산한 참여 점수 기준입니다.</p>
        <div class="h-[260px]">
          <canvas ref="popularRegionCanvas"></canvas>
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
      <div class="panel p-4">
        <h2 class="mb-2 text-lg font-bold text-slate-900">
          {{ selectedDistrict ? `${selectedDistrict} 상세 위치` : '서울 자치구 지도' }}
        </h2>
        <div id="map-container" class="h-[420px] overflow-hidden rounded-lg border-2 border-brand-500 bg-slate-100"></div>
      </div>

      <div class="space-y-3">
        <div>
          <h2 class="text-lg font-bold text-slate-900">추천 정보</h2>
          <p class="text-sm text-slate-600">콘텐츠 차트에서 카테고리를 클릭하면 추천 장소를 표시합니다.</p>
        </div>

        <div v-if="!selectedCategory" class="panel p-4 text-sm text-slate-600">
          콘텐츠 유형별 비율 차트에서 카테고리를 선택해 주세요.
        </div>

        <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <router-link
            v-for="item in recommendedItems"
            :key="item.id"
            :to="`/place/${encodeURIComponent(item.id)}`"
            class="panel grid grid-cols-[88px_1fr] overflow-hidden transition hover:border-brand-300 hover:shadow-md"
          >
            <div class="flex h-24 items-center justify-center bg-slate-100">
              <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.title" class="h-full w-full object-cover" />
              <span v-else class="text-xs text-slate-500">이미지 없음</span>
            </div>
            <div class="min-w-0 p-3">
              <div class="flex items-center gap-2 text-[11px] font-semibold text-brand-700">
                <span>{{ item.category }}</span>
                <span class="text-slate-300">/</span>
                <span>{{ item.district }}</span>
              </div>
              <h3 class="mt-2 line-clamp-2 text-sm font-bold text-slate-900">{{ item.title }}</h3>
              <p class="mt-1 line-clamp-2 text-xs text-slate-600">{{ item.address }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import KpiCard from '../components/KpiCard.vue'
import { getByCategory, getByDistrict, getDashboardStats } from '../utils/dataLoader'
import { REGION_OPTIONS, getPosts } from '../utils/localStorage'

const categoryCanvas = ref(null)
const districtCanvas = ref(null)
const postRegionCanvas = ref(null)
const popularRegionCanvas = ref(null)

const total = ref('--')
const categoryCount = ref('--')
const postCount = ref('--')
const topRegion = ref('-')
const selectedCategory = ref('')
const selectedDistrict = ref(null)
const recommendedItems = ref([])

const charts = []
const palette = ['#2563eb', '#0891b2', '#16a34a', '#f59e0b', '#e11d48', '#7c3aed', '#475569']

let map = null
let markerLayer = null

function createEmptyRegionCount() {
  return REGION_OPTIONS.reduce((acc, region) => {
    acc[region] = 0
    return acc
  }, {})
}

function getPostRegionCounts(posts) {
  return posts.reduce((acc, post) => {
    const region = REGION_OPTIONS.includes(post.region) ? post.region : REGION_OPTIONS[0]
    acc[region] = (acc[region] || 0) + 1
    return acc
  }, createEmptyRegionCount())
}

function getPopularRegionScores(posts) {
  return posts.reduce((acc, post) => {
    const region = REGION_OPTIONS.includes(post.region) ? post.region : REGION_OPTIONS[0]
    const score = Number(post.views || 0) + Number(post.likes || 0) * 2 + Number(post.bookmarks || 0) * 3
    acc[region] = (acc[region] || 0) + score
    return acc
  }, createEmptyRegionCount())
}

function regionEntries(mapObject) {
  return Object.entries(mapObject).sort((a, b) => b[1] - a[1])
}

async function loadRecommended(category) {
  selectedCategory.value = category
  const items = await getByCategory(category)
  recommendedItems.value = [...items].sort(() => 0.5 - Math.random()).slice(0, 5)
}

function chartBaseOptions(extra = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    },
    ...extra
  }
}

function createCharts(stats, posts) {
  const categoryEntries = Object.entries(stats.categoryCounts).sort((a, b) => b[1] - a[1])
  const districtEntries = Object.entries(stats.districtCounts)
    .filter(([district]) => district !== '미분류')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
  const postRegionEntries = regionEntries(getPostRegionCounts(posts))
  const popularRegionEntries = regionEntries(getPopularRegionScores(posts))

  charts.push(new Chart(categoryCanvas.value, {
    type: 'doughnut',
    data: {
      labels: categoryEntries.map(([label]) => label),
      datasets: [{ data: categoryEntries.map(([, count]) => count), backgroundColor: palette }]
    },
    options: chartBaseOptions({
      onClick(event, elements) {
        if (elements.length) loadRecommended(this.data.labels[elements[0].index])
      }
    })
  }))

  charts.push(new Chart(districtCanvas.value, {
    type: 'bar',
    data: {
      labels: districtEntries.map(([label]) => label),
      datasets: [{ label: '콘텐츠 수', data: districtEntries.map(([, count]) => count), backgroundColor: '#2563eb' }]
    },
    options: chartBaseOptions({
      indexAxis: 'y',
      onClick(event, elements) {
        if (elements.length) selectedDistrict.value = this.data.labels[elements[0].index]
      }
    })
  }))

  charts.push(new Chart(postRegionCanvas.value, {
    type: 'bar',
    data: {
      labels: postRegionEntries.map(([label]) => label),
      datasets: [{ label: '게시글 수', data: postRegionEntries.map(([, count]) => count), backgroundColor: '#16a34a' }]
    },
    options: chartBaseOptions()
  }))

  charts.push(new Chart(popularRegionCanvas.value, {
    type: 'bar',
    data: {
      labels: popularRegionEntries.map(([label]) => label),
      datasets: [{ label: '참여 점수', data: popularRegionEntries.map(([, score]) => score), backgroundColor: '#f59e0b' }]
    },
    options: chartBaseOptions({ indexAxis: 'y' })
  }))
}

function initMap() {
  map = L.map('map-container').setView([37.5665, 126.978], 11)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap'
  }).addTo(map)
  markerLayer = L.layerGroup().addTo(map)
}

function isValidSeoulLocation(lat, lng) {
  return lat >= 37.4 && lat <= 37.8 && lng >= 126.7 && lng <= 127.3
}

async function updateMarkers(district) {
  if (!markerLayer || !map) return
  markerLayer.clearLayers()

  const items = await getByDistrict(district)
  const bounds = []

  items.forEach((item) => {
    const lat = Number(item.mapy)
    const lng = Number(item.mapx)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return
    if (!isValidSeoulLocation(lat, lng)) return

    const marker = L.marker([lat, lng]).addTo(markerLayer)
    marker.bindPopup(`<strong>${item.title}</strong><br>${item.address || ''}`)
    bounds.push([lat, lng])
  })

  if (!bounds.length) {
    map.setView([37.5665, 126.978], 11)
    return
  }

  if (bounds.length === 1) {
    map.setView(bounds[0], 15)
  } else {
    map.fitBounds(bounds, { padding: [24, 24] })
  }
}

watch(selectedDistrict, (district) => {
  if (district) updateMarkers(district)
})

onMounted(async () => {
  const stats = await getDashboardStats()
  const posts = getPosts()
  const popularEntries = regionEntries(getPopularRegionScores(posts))

  total.value = stats.total.toLocaleString()
  categoryCount.value = stats.categories.length
  postCount.value = posts.length
  topRegion.value = popularEntries[0]?.[1] > 0 ? popularEntries[0][0] : '-'

  initMap()
  requestAnimationFrame(() => createCharts(stats, posts))
})

onBeforeUnmount(() => {
  charts.forEach((chart) => chart.destroy())
  if (map) map.remove()
})
</script>
