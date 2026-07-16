<template>
  <div class="p-4 md:p-6 space-y-6">
    <!-- 1. KPI 섹션 -->
    <section class="grid grid-cols-3 gap-2 md:gap-4">
      <KpiCard label="전체 콘텐츠" :value="total" />
      <KpiCard label="카테고리 수" :value="categoryCount" />
      <KpiCard label="커뮤니티 게시글" :value="postCount" />
    </section>

    <!-- 2. 차트 섹션 -->
    <section class="grid grid-cols-[45%_55%] gap-6">
      <!-- 카테고리 비율 (도넛 차트) -->
      <div class="panel p-4">
        <h2 class="font-semibold text-slate-900 mb-4">콘텐츠별 카테고리 비율</h2>
        <div class="h-[260px] flex justify-center items-center">
          <canvas ref="doughnutCanvas"></canvas>
        </div>
      </div>

      <!-- 자치구 밀집도 (폴라 차트) -->
      <div class="panel p-4">
        <h2 class="font-semibold text-slate-900 mb-4">자치구별 콘텐츠 밀집도</h2>
        <div class="h-[260px]">
          <canvas ref="districtCanvas"></canvas>
        </div>
      </div>
    </section>

    <!-- 3. 지도 및 추천 정보 섹션 -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 지도 시각화 영역 (Leaflet) -->
      <div class="panel p-4 md:col-span-2">
        <h2 class="text-lg font-bold text-slate-900 mb-2">
          {{ selectedDistrict ? `${selectedDistrict} 상세 위치` : '자치구 지도' }}
        </h2>
        <div id="map-container" class="h-[420px] bg-slate-100 rounded-lg overflow-hidden border-2 border-brand-500">
        </div>
      </div>

      <!-- 추천 정보 영역 -->
      <div class="md:col-span-3 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="text-lg font-bold text-slate-900">추천 정보</h2>
            <p class="text-sm text-slate-600">카테고리를 클릭하면 해당 카테고리의 추천 지역을 보여줍니다.</p>
          </div>
          <p class="text-sm text-slate-500">선택된 카테고리: <span class="font-semibold text-brand-700">{{ selectedCategory || '없음' }}</span></p>
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
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Chart from 'chart.js/auto'
import KpiCard from '../components/KpiCard.vue'
import { getDashboardStats, getByCategory, getByDistrict } from '../utils/dataLoader'
import { getPosts } from '../utils/localStorage'

// 상태 관리
const doughnutCanvas = ref(null)
const districtCanvas = ref(null)
const total = ref('--')
const categoryCount = ref('--')
const postCount = ref('--')
const selectedCategory = ref('')
const selectedDistrict = ref(null)
const recommendedItems = ref([])
const charts = []

// 지도 상태
let map = null
let markerLayer = null
const palette = ['#4f46e5', '#0891b2', '#16a34a', '#f59e0b', '#e11d48', '#7c3aed', '#475569']

// 지도 초기화
function initMap() {
  map = L.map('map-container').setView([37.5665, 126.978], 11)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map)
  markerLayer = L.layerGroup().addTo(map)
}

function isValidSeoulLocation(lat, lng) {
  return lat >= 37.4 && lat <= 37.8 && lng >= 126.7 && lng <= 127.3
}

// 마커 업데이트 로직
async function updateMarkers(district) {
  if (!markerLayer || !map) return
  markerLayer.clearLayers()
  
  const items = await getByDistrict(district)
  const bounds = []

  items.forEach(item => {
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

// 감시자 설정
watch(selectedDistrict, (newDist) => {
  if (newDist) {
    updateMarkers(newDist)
  }
})

async function loadRecommended(category) {
  selectedCategory.value = category
  const items = await getByCategory(category)
  recommendedItems.value = [...items].sort(() => 0.5 - Math.random()).slice(0, 5)
}

// 차트 생성 로직
function createCharts(stats) {
  const categoryEntries = Object.entries(stats.categoryCounts).sort((a, b) => b[1] - a[1])
  const districtEntries = Object.entries(stats.districtCounts)
    .filter(([d]) => d !== '미분류')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  // 도넛 차트
  charts.push(new Chart(doughnutCanvas.value, {
    type: 'doughnut',
    data: { 
      labels: categoryEntries.map(e => e[0]), 
      datasets: [{ data: categoryEntries.map(e => e[1]), backgroundColor: palette }] 
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      onClick(evt, elements) {
        if (elements.length) loadRecommended(this.data.labels[elements[0].index])
      }
    }
  }))

  // 폴라 차트
  charts.push(new Chart(districtCanvas.value, {
    type: 'polarArea',
    data: { 
      labels: districtEntries.map(e => e[0]), 
      datasets: [{ data: districtEntries.map(e => e[1]), backgroundColor: palette.map(c => c + '90') }] 
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      onClick(evt, elements) {
        if (elements.length) selectedDistrict.value = this.data.labels[elements[0].index]
      }
    }
  }))
}

// 생명주기 관리
onMounted(async () => {
  const stats = await getDashboardStats()
  total.value = stats.total.toLocaleString()
  categoryCount.value = stats.categories.length
  postCount.value = getPosts().length
  
  initMap()
  requestAnimationFrame(() => createCharts(stats))
})

onBeforeUnmount(() => {
  charts.forEach(c => c.destroy())
  if (map) map.remove()
})
</script>
