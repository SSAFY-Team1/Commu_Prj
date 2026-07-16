<template>
  <div class="space-y-5">
    <router-link to="/category/all" class="text-sm font-semibold text-brand-700 hover:underline">← 지역 정보 목록</router-link>

    <section v-if="loading" class="panel p-6 text-sm text-slate-600">상세 정보를 불러오는 중입니다...</section>

    <section v-else-if="!item" class="panel p-6">
      <h1 class="text-2xl font-bold text-slate-900">지역 정보를 찾을 수 없습니다</h1>
      <p class="mt-2 text-sm text-slate-600">데이터가 갱신되었거나 잘못된 주소일 수 있습니다.</p>
      <router-link to="/category/all" class="mt-4 inline-flex rounded bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">목록으로 돌아가기</router-link>
    </section>

    <article v-else class="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div class="space-y-5">
        <div class="panel overflow-hidden">
        <div class="flex aspect-[4/3] items-center justify-center bg-slate-100">
          <img v-if="item.image || item.thumbnail" :src="item.image || item.thumbnail" :alt="item.title" class="h-full w-full object-cover" />
          <span v-else class="text-sm text-slate-500">이미지 없음</span>
        </div>
        </div>

        <section class="panel p-4">
          <div class="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 class="font-bold text-slate-900">지도 위치</h2>
              <p class="text-sm text-slate-600">제공 좌표를 기반으로 위치를 표시합니다.</p>
            </div>
            <span class="rounded bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">{{ item.category }}</span>
          </div>
          <div v-if="hasCoordinates" ref="detailMapEl" class="h-72 overflow-hidden rounded border border-slate-200 bg-slate-100"></div>
          <div v-else class="rounded border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">좌표 정보가 없어 지도를 표시할 수 없습니다.</div>
        </section>
      </div>

      <div class="panel p-5">
        <div class="flex flex-wrap gap-2 text-xs font-semibold">
          <span class="rounded bg-brand-50 px-2 py-1 text-brand-700">{{ item.category }}</span>
          <span class="rounded bg-slate-100 px-2 py-1 text-slate-600">{{ item.district }}</span>
        </div>

        <h1 class="mt-3 text-3xl font-bold text-slate-900">{{ item.title }}</h1>
        <p class="mt-3 text-sm text-slate-600">한국관광공사 TourAPI 4.0 제공 데이터를 기반으로 표시합니다.</p>

        <dl class="mt-6 divide-y divide-slate-200 text-sm">
          <div class="grid gap-2 py-3 sm:grid-cols-[120px_1fr]">
            <dt class="font-semibold text-slate-700">주소</dt>
            <dd class="text-slate-900">{{ fullAddress }}</dd>
          </div>
          <div class="grid gap-2 py-3 sm:grid-cols-[120px_1fr]">
            <dt class="font-semibold text-slate-700">전화번호</dt>
            <dd class="text-slate-900">{{ item.tel }}</dd>
          </div>
          <div class="grid gap-2 py-3 sm:grid-cols-[120px_1fr]">
            <dt class="font-semibold text-slate-700">좌표</dt>
            <dd class="text-slate-900">{{ coordinates }}</dd>
          </div>
          <div v-if="item.eventStartDate || item.eventEndDate" class="grid gap-2 py-3 sm:grid-cols-[120px_1fr]">
            <dt class="font-semibold text-slate-700">행사 기간</dt>
            <dd class="text-slate-900">{{ eventDate }}</dd>
          </div>
        </dl>
      </div>
    </article>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getItemById } from '../utils/dataLoader'

const props = defineProps({
  id: { type: String, required: true }
})

const loading = ref(true)
const item = ref(null)
const detailMapEl = ref(null)
let detailMap = null

const fullAddress = computed(() => [item.value?.address, item.value?.addressDetail].filter(Boolean).join(' '))
const coordinates = computed(() => {
  if (!item.value || item.value.mapx === null || item.value.mapy === null) return '좌표 정보 없음'
  return `${item.value.mapy}, ${item.value.mapx}`
})
const hasCoordinates = computed(() => item.value && item.value.mapx !== null && item.value.mapy !== null)
const eventDate = computed(() => [item.value?.eventStartDate, item.value?.eventEndDate].filter(Boolean).join(' ~ '))

async function loadItem() {
  loading.value = true
  destroyMap()
  item.value = await getItemById(decodeURIComponent(props.id))
  loading.value = false
  await nextTick()
  renderMap()
}

function destroyMap() {
  if (detailMap) {
    detailMap.remove()
    detailMap = null
  }
}

function renderMap() {
  if (!hasCoordinates.value || !detailMapEl.value) return

  const lat = Number(item.value.mapy)
  const lng = Number(item.value.mapx)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return

  detailMap = L.map(detailMapEl.value, {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView([lat, lng], 15)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap'
  }).addTo(detailMap)

  L.marker([lat, lng])
    .addTo(detailMap)
    .bindPopup(`<strong>${item.value.title}</strong><br>${item.value.address || ''}`)
    .openPopup()
}

watch(() => props.id, loadItem)
onMounted(loadItem)
onBeforeUnmount(destroyMap)
</script>
