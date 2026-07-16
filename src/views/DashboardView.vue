<template>
  <div class="space-y-6 p-4 md:p-6">
    <section class="grid grid-cols-2 gap-3 md:grid-cols-4">
      <KpiCard label="전체 콘텐츠" :value="total" />
      <KpiCard label="카테고리 수" :value="categoryCount" />
      <KpiCard label="커뮤니티 게시글" :value="postCount" />
      <KpiCard label="인기 자치구" :value="topDistrict" />
    </section>

    <section class="grid gap-6 xl:grid-cols-2">
      <div class="panel p-4">
        <h2 class="mb-4 font-semibold text-slate-900">콘텐츠 유형별 비율</h2>
        <div class="h-[240px] sm:h-[280px]">
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

    <section class="grid gap-6 xl:grid-cols-2">
      <div class="panel p-4">
        <h2 class="mb-2 font-semibold text-slate-900">자치구별 게시글 현황</h2>
        <p class="mb-4 text-sm text-slate-600">커뮤니티 게시글의 자치구 값을 기준으로 집계합니다.</p>
        <div class="h-[260px]">
          <canvas ref="postDistrictCanvas"></canvas>
        </div>
      </div>

      <div class="panel p-4">
        <h2 class="mb-2 font-semibold text-slate-900">인기 자치구 통계</h2>
        <p class="mb-4 text-sm text-slate-600">조회수, 좋아요, 북마크를 합산한 참여 점수 기준입니다.</p>
        <div class="h-[260px]">
          <canvas ref="popularDistrictCanvas"></canvas>
        </div>
      </div>
    </section>

    <section class="panel p-4">
      <div class="mb-3 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 class="text-lg font-bold text-slate-900">
            {{ selectedDistrict ? `${selectedDistrict} 지도 핀` : '서울 지도 핀 시각화' }}
          </h2>
          <p class="text-sm text-slate-600">그래프나 필터를 선택하면 카테고리별 색상 마커가 표시됩니다.</p>
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

      <div id="map-container" class="h-[320px] overflow-hidden rounded-lg border-2 border-brand-500 bg-slate-100 sm:h-[420px]"></div>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <section class="space-y-3">
        <div>
          <h2 class="text-lg font-bold text-slate-900">추천 정보</h2>
          <p class="text-sm text-slate-600">콘텐츠 차트나 카테고리 필터를 선택하면 추천 장소 5개를 표시합니다.</p>
        </div>

        <div v-if="!selectedCategory" class="panel p-4 text-sm text-slate-600">
          콘텐츠 유형별 비율 차트 또는 카테고리 필터를 선택해 주세요.
        </div>

        <div v-else class="grid gap-3">
          <router-link
            v-for="item in recommendedItems"
            :key="item.id"
            :to="`/place/${encodeURIComponent(item.id)}`"
            class="panel grid grid-cols-[88px_1fr] overflow-hidden transition hover:border-brand-300 hover:shadow-md sm:grid-cols-[112px_1fr]"
          >
            <div class="flex h-24 items-center justify-center bg-slate-100 sm:h-28">
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
          <h2 class="text-lg font-bold text-slate-900">자치구별 커뮤니티 글</h2>
          <p class="text-sm text-slate-600">게시글/인기 자치구 차트나 자치구 필터를 선택하면 최근 글 5개를 표시합니다.</p>
        </div>

        <div v-if="!selectedPostDistrict" class="panel p-4 text-sm text-slate-600">
          자치구별 게시글 현황 차트, 인기 자치구 통계 또는 자치구 필터를 선택해 주세요.
        </div>

        <div v-else-if="districtPosts.length === 0" class="panel p-4 text-sm text-slate-600">
          {{ selectedPostDistrict }}에 등록된 게시글이 없습니다.
        </div>

        <template v-else>
          <router-link
            v-for="post in districtPosts"
            :key="post.id"
            to="/community"
            class="panel block p-3 transition hover:border-brand-300 hover:shadow-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <h3 class="line-clamp-1 font-semibold text-slate-900">{{ post.title }}</h3>
              <span class="shrink-0 text-xs text-slate-500">조회 {{ post.views }}</span>
            </div>
            <p class="mt-1 line-clamp-2 text-sm text-slate-600">{{ post.content }}</p>
            <div class="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span>{{ post.district }}</span>
              <span class="inline-flex items-center gap-1">
                <svg class="h-3.5 w-3.5 text-rose-500" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.8 5.6c-1.6-1.7-4.1-1.8-5.8-.2L12 8.2 9 5.4c-1.7-1.6-4.2-1.5-5.8.2-1.7 1.8-1.6 4.6.2 6.3L12 20l8.6-8.1c1.8-1.7 1.9-4.5.2-6.3Z" fill="currentColor" />
                </svg>
                {{ post.likes }}
              </span>
              <span class="inline-flex items-center gap-1">
                <svg class="h-3.5 w-3.5 text-brand-600" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V21l-6-3.5L6 21V4.5Z" fill="currentColor" />
                </svg>
                {{ post.bookmarks }}
              </span>
            </div>
          </router-link>
        </template>
      </section>
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
import { DEFAULT_DISTRICT, DISTRICT_OPTIONS, getPosts } from '../utils/localStorage'

const categoryCanvas = ref(null)
const districtCanvas = ref(null)
const postDistrictCanvas = ref(null)
const popularDistrictCanvas = ref(null)

const total = ref('--')
const categoryCount = ref('--')
const postCount = ref('--')
const topDistrict = ref('-')
const selectedCategory = ref('')
const selectedDistrict = ref('')
const selectedMapCategory = ref('')
const selectedPostDistrict = ref('')
const recommendedItems = ref([])
const allItems = ref([])
const posts = ref([])

const charts = []
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
const districtPosts = computed(() =>
  posts.value
    .filter((post) => post.district === selectedPostDistrict.value)
    .slice()
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .slice(0, 5)
)

function createEmptyDistrictCount() {
  return DISTRICT_OPTIONS.reduce((acc, district) => {
    acc[district] = 0
    return acc
  }, {})
}

function getPostDistrictCounts(postItems) {
  return postItems.reduce((acc, post) => {
    const district = DISTRICT_OPTIONS.includes(post.district) ? post.district : DEFAULT_DISTRICT
    acc[district] = (acc[district] || 0) + 1
    return acc
  }, createEmptyDistrictCount())
}

function getPopularDistrictScores(postItems) {
  return postItems.reduce((acc, post) => {
    const district = DISTRICT_OPTIONS.includes(post.district) ? post.district : DEFAULT_DISTRICT
    const score = Number(post.views || 0) + Number(post.likes || 0) * 2 + Number(post.bookmarks || 0) * 3
    acc[district] = (acc[district] || 0) + score
    return acc
  }, createEmptyDistrictCount())
}

function sortedEntries(mapObject) {
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
  const postDistrictEntries = sortedEntries(getPostDistrictCounts(postItems)).filter(([, count]) => count > 0)
  const popularDistrictEntries = sortedEntries(getPopularDistrictScores(postItems)).filter(([, score]) => score > 0)

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

  charts.push(new Chart(postDistrictCanvas.value, {
    type: 'bar',
    data: {
      labels: postDistrictEntries.map(([label]) => label),
      datasets: [{ label: '게시글 수', data: postDistrictEntries.map(([, count]) => count), backgroundColor: '#16a34a' }]
    },
    options: chartBaseOptions({
      onClick(event, elements) {
        if (elements.length) selectedPostDistrict.value = this.data.labels[elements[0].index]
      }
    })
  }))

  charts.push(new Chart(popularDistrictCanvas.value, {
    type: 'bar',
    data: {
      labels: popularDistrictEntries.map(([label]) => label),
      datasets: [{ label: '참여 점수', data: popularDistrictEntries.map(([, score]) => score), backgroundColor: '#f59e0b' }]
    },
    options: chartBaseOptions({
      indexAxis: 'y',
      onClick(event, elements) {
        if (elements.length) selectedPostDistrict.value = this.data.labels[elements[0].index]
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

watch(selectedMapCategory, (category) => {
  if (!category) {
    selectedCategory.value = ''
    recommendedItems.value = []
    return
  }
  if (category !== selectedCategory.value) loadRecommended(category)
})

watch(selectedDistrict, (district) => {
  if (district) selectedPostDistrict.value = district
})

watch([selectedDistrict, selectedMapCategory], updateMarkers)

onMounted(async () => {
  const stats = await getDashboardStats()
  allItems.value = await getAllItems()
  posts.value = getPosts()
  const popularEntries = sortedEntries(getPopularDistrictScores(posts.value))

  total.value = stats.total.toLocaleString()
  categoryCount.value = stats.categories.length
  postCount.value = posts.value.length
  topDistrict.value = popularEntries[0]?.[1] > 0 ? popularEntries[0][0] : '-'

  initMap()
  updateMarkers()
  requestAnimationFrame(() => createCharts(stats, posts.value))
})

onBeforeUnmount(() => {
  charts.forEach((chart) => chart.destroy())
  if (map) map.remove()
})
</script>
