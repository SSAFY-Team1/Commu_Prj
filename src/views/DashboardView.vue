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
        <div class="mb-3 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900">
              {{ selectedDistrict ? `${selectedDistrict} 지도 핀` : '서울 지도 핀 시각화' }}
            </h2>
            <p class="text-sm text-slate-600">카테고리별 색상 마커로 관광 데이터를 표시합니다.</p>
          </div>
          <div class="grid gap-2 sm:grid-cols-2 xl:w-[420px]">
            <label>
              <span class="mb-1 block text-xs font-semibold text-slate-600">자치구 필터</span>
              <select v-model="selectedDistrict" class="field">
                <option value="">전체</option>
                <option v-for="district in districtOptions" :key="district" :value="district">{{ district }}</option>
              </select>
            </label>
            <label>
              <span class="mb-1 block text-xs font-semibold text-slate-600">카테고리 필터</span>
              <select v-model="selectedMapCategory" class="field">
                <option value="">전체</option>
                <option v-for="category in categoryOptions" :key="category" :value="category">{{ category }}</option>
              </select>
            </label>
          </div>
        </div>

        <div class="mb-3 flex flex-wrap gap-2">
          <span
            v-for="category in categoryOptions"
            :key="category"
            class="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700"
          >
            <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: categoryColor(category) }"></span>
            {{ category }}
          </span>
        </div>

        <div id="map-container" class="h-[420px] overflow-hidden rounded-lg border-2 border-brand-500 bg-slate-100"></div>
      </div>

      <div class="space-y-5">
        <section class="space-y-3">
          <div>
            <h2 class="text-lg font-bold text-slate-900">추천 정보</h2>
            <p class="text-sm text-slate-600">콘텐츠 차트에서 카테고리를 클릭하면 추천 장소를 표시합니다.</p>
          </div>

          <div v-if="!selectedCategory" class="panel p-4 text-sm text-slate-600">
            콘텐츠 유형별 비율 차트에서 카테고리를 선택해 주세요.
          </div>

          <div v-else class="grid gap-3">
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
        </section>

        <section class="space-y-3">
          <div>
            <h2 class="text-lg font-bold text-slate-900">권역별 커뮤니티 글</h2>
            <p class="text-sm text-slate-600">{{ selectedPostRegion }} 게시글 최근 5개입니다.</p>
          </div>

          <div v-if="regionPosts.length === 0" class="panel p-4 text-sm text-slate-600">
            해당 권역에 등록된 게시글이 없습니다.
          </div>

          <router-link
            v-for="post in regionPosts"
            v-else
            :key="post.id"
            to="/community"
            class="panel block p-3 transition hover:border-brand-300 hover:shadow-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <h3 class="line-clamp-1 font-semibold text-slate-900">{{ post.title }}</h3>
              <span class="shrink-0 text-xs text-slate-500">조회 {{ post.views }}</span>
            </div>
            <p class="mt-1 line-clamp-2 text-sm text-slate-600">{{ post.content }}</p>
            <div class="mt-2 flex flex-wrap gap-1 text-xs text-slate-500">
              <span>{{ post.region }}</span>
              <span>좋아요 {{ post.likes }}</span>
              <span>북마크 {{ post.bookmarks }}</span>
            </div>
          </router-link>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import KpiCard from '../components/KpiCard.vue'
import { getAllItems, getByCategory, getDashboardStats } from '../utils/dataLoader'
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
const selectedDistrict = ref('')
const selectedMapCategory = ref('')
const selectedPostRegion = ref(REGION_OPTIONS[0])
const recommendedItems = ref([])
const allItems = ref([])
const posts = ref([])

const charts = []
const palette = ['#2563eb', '#0891b2', '#16a34a', '#f59e0b', '#e11d48', '#7c3aed', '#475569']
const categoryColors = {
  관광지: '#2563eb',
  문화시설: '#7c3aed',
  축제공연행사: '#e11d48',
  여행코스: '#16a34a',
  레포츠: '#f59e0b',
  숙박: '#0891b2',
  쇼핑: '#475569'
}

let map = null
let markerLayer = null

const categoryOptions = computed(() => Array.from(new Set(allItems.value.map((item) => item.category))).sort())
const districtOptions = computed(() =>
  Array.from(new Set(allItems.value.map((item) => item.district).filter((district) => district && district !== '미분류'))).sort()
)
const regionPosts = computed(() =>
  posts.value
    .filter((post) => post.region === selectedPostRegion.value)
    .slice()
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .slice(0, 5)
)

function createEmptyRegionCount() {
  return REGION_OPTIONS.reduce((acc, region) => {
    acc[region] = 0
    return acc
  }, {})
}

function getPostRegionCounts(postItems) {
  return postItems.reduce((acc, post) => {
    const region = REGION_OPTIONS.includes(post.region) ? post.region : REGION_OPTIONS[0]
    acc[region] = (acc[region] || 0) + 1
    return acc
  }, createEmptyRegionCount())
}

function getPopularRegionScores(postItems) {
  return postItems.reduce((acc, post) => {
    const region = REGION_OPTIONS.includes(post.region) ? post.region : REGION_OPTIONS[0]
    const score = Number(post.views || 0) + Number(post.likes || 0) * 2 + Number(post.bookmarks || 0) * 3
    acc[region] = (acc[region] || 0) + score
    return acc
  }, createEmptyRegionCount())
}

function regionEntries(mapObject) {
  return Object.entries(mapObject).sort((a, b) => b[1] - a[1])
}

function categoryColor(category) {
  return categoryColors[category] || '#64748b'
}

function markerIcon(category) {
  const color = categoryColor(category)
  return L.divIcon({
    className: 'localhub-map-marker',
    html: `<span style="display:block;width:14px;height:14px;border-radius:999px;background:${color};border:2px solid white;box-shadow:0 1px 8px rgba(15,23,42,.35)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -9]
  })
}

async function loadRecommended(category) {
  selectedCategory.value = category
  selectedMapCategory.value = category
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

function createCharts(stats, postItems) {
  const categoryEntries = Object.entries(stats.categoryCounts).sort((a, b) => b[1] - a[1])
  const districtEntries = Object.entries(stats.districtCounts)
    .filter(([district]) => district !== '미분류')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
  const postRegionEntries = regionEntries(getPostRegionCounts(postItems))
  const popularRegionEntries = regionEntries(getPopularRegionScores(postItems))

  charts.push(new Chart(categoryCanvas.value, {
    type: 'doughnut',
    data: {
      labels: categoryEntries.map(([label]) => label),
      datasets: [{ data: categoryEntries.map(([, count]) => count), backgroundColor: categoryEntries.map(([label]) => categoryColor(label)) }]
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
    options: chartBaseOptions({
      onClick(event, elements) {
        if (elements.length) selectedPostRegion.value = this.data.labels[elements[0].index]
      }
    })
  }))

  charts.push(new Chart(popularRegionCanvas.value, {
    type: 'bar',
    data: {
      labels: popularRegionEntries.map(([label]) => label),
      datasets: [{ label: '참여 점수', data: popularRegionEntries.map(([, score]) => score), backgroundColor: '#f59e0b' }]
    },
    options: chartBaseOptions({
      indexAxis: 'y',
      onClick(event, elements) {
        if (elements.length) selectedPostRegion.value = this.data.labels[elements[0].index]
      }
    })
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

function filteredMapItems() {
  return allItems.value.filter((item) => {
    if (selectedDistrict.value && item.district !== selectedDistrict.value) return false
    if (selectedMapCategory.value && item.category !== selectedMapCategory.value) return false
    return true
  })
}

function updateMarkers() {
  if (!markerLayer || !map) return
  markerLayer.clearLayers()

  if (!selectedDistrict.value && !selectedMapCategory.value) {
    map.setView([37.5665, 126.978], 11)
    return
  }

  const bounds = []
  filteredMapItems().forEach((item) => {
    const lat = Number(item.mapy)
    const lng = Number(item.mapx)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return
    if (!isValidSeoulLocation(lat, lng)) return

    const marker = L.marker([lat, lng], { icon: markerIcon(item.category) }).addTo(markerLayer)
    marker.bindPopup(`<strong>${item.title}</strong><br>${item.category}<br>${item.address || ''}`)
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

watch([selectedDistrict, selectedMapCategory], updateMarkers)

onMounted(async () => {
  const stats = await getDashboardStats()
  allItems.value = await getAllItems()
  posts.value = getPosts()
  const popularEntries = regionEntries(getPopularRegionScores(posts.value))

  total.value = stats.total.toLocaleString()
  categoryCount.value = stats.categories.length
  postCount.value = posts.value.length
  topRegion.value = popularEntries[0]?.[1] > 0 ? popularEntries[0][0] : '-'

  initMap()
  updateMarkers()
  requestAnimationFrame(() => createCharts(stats, posts.value))
})

onBeforeUnmount(() => {
  charts.forEach((chart) => chart.destroy())
  if (map) map.remove()
})
</script>
