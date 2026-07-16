<template>
  <div class="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">서울 축제 캘린더</h1>
        <p class="mt-1 text-sm text-slate-600">축제공연행사 데이터를 월간 캘린더와 목록으로 전환해서 볼 수 있습니다.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          @click="viewMode = 'month'"
          :class="viewMode === 'month' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
          class="rounded-md px-4 py-2 text-sm font-medium transition"
        >
          월별 보기
        </button>
        <button
          type="button"
          @click="viewMode = 'list'"
          :class="viewMode === 'list' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
          class="rounded-md px-4 py-2 text-sm font-medium transition"
        >
          목록 보기
        </button>
      </div>
    </div>

    <div v-if="viewMode === 'month'" class="space-y-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <p class="text-sm font-medium text-slate-500">현재 월</p>
          <h2 class="text-xl font-semibold text-slate-900">{{ currentMonthLabel }}</h2>
          <p class="text-sm text-slate-600">이번 달 축제: {{ monthEvents.length }}개</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="prevMonth"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100"
            aria-label="이전 달"
          >
            ‹
          </button>
          <button
            type="button"
            @click="nextMonth"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100"
            aria-label="다음 달"
          >
            ›
          </button>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <button
          type="button"
          class="flex w-full items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-left text-slate-900 shadow-sm transition hover:bg-slate-50"
          @click="isLongTermExpanded = !isLongTermExpanded"
        >
          <div>
            <p class="text-sm font-medium text-slate-900">이번 달 상시/장기 진행 축제</p>
            <p class="text-sm text-slate-500">{{ monthLongEvents.length }}개</p>
          </div>
          <span :class="['text-lg transition-transform', isLongTermExpanded ? 'rotate-180' : 'rotate-0']">▾</span>
        </button>

        <div v-if="monthLongEvents.length && isLongTermExpanded" class="mt-4 flex flex-wrap gap-2">
          <div
            v-for="event in monthLongEvents"
            :key="event.id"
            class="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-200"
            :title="formatDisplayDate(event.start) + ' ~ ' + formatDisplayDate(event.end)"
          >
            {{ event.title }}
          </div>
        </div>

        <div v-if="!monthLongEvents.length" class="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600 text-center">
          이번 달에는 상시/장기 진행 축제가 없습니다.
        </div>
      </div>

      <div class="grid grid-cols-7 gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
        <div v-for="label in weekdayLabels" :key="label" class="py-2">{{ label }}</div>
      </div>

      <div class="grid grid-cols-7 gap-1 text-sm">
        <div
          v-for="cell in calendarCells"
          :key="cell.key"
          @click="cell.currentMonth && selectDate(cell.date)"
          :class="[
            'min-h-[110px] overflow-hidden rounded-xl border p-2 transition',
            cell.currentMonth ? 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 cursor-pointer' : 'border-transparent bg-slate-50 text-slate-400 cursor-default',
            isSameDate(cell.date, selectedDate) ? 'border-indigo-500 bg-indigo-50' : ''
          ]"
        >
          <div class="flex w-full flex-col items-start gap-2 text-left">
            <span class="text-sm font-medium" :class="cell.currentMonth ? 'text-slate-900' : 'text-slate-400'">{{ cell.date.getDate() }}</span>
            <div class="flex flex-col gap-1">
              <template v-if="cell.events.length">
                <div
                  v-for="(event, index) in cell.events.slice(0, 2)"
                  :key="event.id + '-' + index"
                  class="inline-flex min-w-0 max-w-full truncate rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-800 overflow-hidden whitespace-nowrap"
                  :title="event.title"
                >
                  {{ event.title }}
                </div>
                <div v-if="cell.overflow" class="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">+{{ cell.overflow }}개</div>
              </template>
              <template v-else>
                <span class="h-2 w-full"></span>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-slate-500">선택된 날짜</p>
            <h3 class="text-lg font-semibold text-slate-900">{{ formatDisplayDate(selectedDate) }}</h3>
          </div>
          <p class="text-sm text-slate-600">{{ selectedDateEvents.length }}개의 축제</p>
        </div>

        <div class="mt-4 space-y-3">
          <div v-if="selectedDateEvents.length">
            <div
              v-for="event in selectedDateEvents"
              :key="event.id"
              class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p class="text-sm font-semibold text-slate-900">{{ event.title }}</p>
                  <p class="mt-1 text-sm text-slate-500">{{ formatDisplayDate(event.start) }} ~ {{ formatDisplayDate(event.end) }}</p>
                </div>
                <p class="text-sm text-slate-600">{{ event.address }}</p>
              </div>
            </div>
          </div>
          <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-600">
            이 날짜에는 예정된 축제가 없습니다.
          </div>
        </div>
      </div>
    </div>

    <div v-else class="space-y-4">
      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <button
          type="button"
          class="flex w-full items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-left text-slate-900 shadow-sm transition hover:bg-slate-50"
          @click="isLongTermExpanded = !isLongTermExpanded"
        >
          <div>
            <p class="text-sm font-medium text-slate-900">장기 진행 축제</p>
            <p class="text-sm text-slate-500">{{ longTermFestivals.length }}개</p>
          </div>
          <span :class="['text-lg transition-transform', isLongTermExpanded ? 'rotate-180' : 'rotate-0']">▾</span>
        </button>

        <div v-if="longTermFestivals.length && isLongTermExpanded" class="mt-4 flex flex-wrap gap-2">
          <div
            v-for="event in longTermFestivals"
            :key="event.id"
            class="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-200"
            :title="formatDisplayDate(event.start) + ' ~ ' + formatDisplayDate(event.end)"
          >
            {{ event.title }}
          </div>
        </div>

        <div v-if="!longTermFestivals.length" class="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-600">
          장기 진행 축제가 없습니다.
        </div>
      </div>

      <div class="grid gap-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-slate-900">단기 축제 목록</h2>
            <p class="text-sm text-slate-600">시작일 기준으로 정렬된 단기 축제입니다.</p>
          </div>
          <span class="text-sm text-slate-600">{{ shortFestivals.length }}개</span>
        </div>

        <div v-if="shortFestivals.length" class="space-y-4">
          <div
            v-for="event in shortFestivals"
            :key="event.id"
            :class="['rounded-2xl border p-4 shadow-sm transition', event.past ? 'bg-slate-50 text-slate-500' : 'bg-white text-slate-900']"
          >
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-lg font-semibold">{{ event.title }}</p>
                <p class="mt-1 text-sm text-slate-500">{{ formatDisplayDate(event.start) }} ~ {{ formatDisplayDate(event.end) }}</p>
              </div>
              <span
                class="rounded-full px-3 py-1 text-xs font-semibold"
                :class="event.past ? 'bg-slate-200 text-slate-500' : 'bg-indigo-100 text-indigo-800'"
              >
                {{ event.past ? '지난 축제' : '예정 축제' }}
              </span>
            </div>
            <p class="mt-3 text-sm text-slate-600">{{ event.address }}</p>
          </div>
        </div>
        <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600">
          단기 축제가 없습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { getByCategory } from '../utils/dataLoader'

const viewMode = ref('month')
const festivalItems = ref([])
const currentDate = ref(new Date())
const selectedDate = ref(new Date())
const isLongTermExpanded = ref(false)

const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토']
const DAY_MS = 1000 * 60 * 60 * 24

function parseFestivalDate(value, id) {
  if (!value || typeof value !== 'string') {
    console.warn('FestivalCalendar: missing event date', id, value)
    return null
  }

  const compactMatch = value.match(/^(\d{4})(\d{2})(\d{2})$/)
  if (compactMatch) {
    const year = Number(compactMatch[1])
    const month = Number(compactMatch[2])
    const day = Number(compactMatch[3])
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return new Date(year, month - 1, day)
    }
  }

  const dashMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (dashMatch) {
    const year = Number(dashMatch[1])
    const month = Number(dashMatch[2])
    const day = Number(dashMatch[3])
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return new Date(year, month - 1, day)
    }
  }

  console.warn('FestivalCalendar: invalid date format', id, value)
  return null
}

function isSameDate(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function formatDisplayDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '알 수 없는 날짜'
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

function compareByStartDesc(a, b) {
  if (!a?.start && !b?.start) return 0
  if (!a?.start) return 1
  if (!b?.start) return -1
  return b.start - a.start
}

function normalizeFestival(item) {
  const start = parseFestivalDate(item.eventStartDate, item.id)
  const end = parseFestivalDate(item.eventEndDate, item.id)
  if (!start || !end) return null
  if (end < start) {
    console.warn('FestivalCalendar: end date is before start date', item.id, item.eventStartDate, item.eventEndDate)
    return null
  }

  const durationDays = Math.round((end.getTime() - start.getTime()) / DAY_MS) + 1
  return {
    ...item,
    start,
    end,
    durationDays,
    long: durationDays > 14,
    past: end < new Date(),
    title: item.title || item.name || '제목 없음'
  }
}

const normalizedFestivals = computed(() => {
  return festivalItems.value
    .map(normalizeFestival)
    .filter((item) => item !== null)
    .sort((a, b) => a.start - b.start)
})

const longTermFestivals = computed(() => normalizedFestivals.value.filter((event) => event.long))
const shortFestivals = computed(() => normalizedFestivals.value.filter((event) => !event.long))

const currentMonthLabel = computed(() => {
  return `${currentDate.value.getFullYear()}년 ${String(currentDate.value.getMonth() + 1).padStart(2, '0')}월`
})

const monthStart = computed(() => new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1))
const monthEnd = computed(() => new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0))

const monthEvents = computed(() => {
  return normalizedFestivals.value.filter((event) => event.start <= monthEnd.value && event.end >= monthStart.value)
})

const monthLongEvents = computed(() => {
  return longTermFestivals.value.filter((event) => event.start <= monthEnd.value && event.end >= monthStart.value)
})

const monthShortEvents = computed(() => {
  return shortFestivals.value.filter((event) => event.start <= monthEnd.value && event.end >= monthStart.value)
})

const selectedDateEvents = computed(() => {
  return normalizedFestivals.value
    .filter((event) => event.start <= selectedDate.value && event.end >= selectedDate.value)
    .slice()
    .sort(compareByStartDesc)
})

const calendarCells = computed(() => {
  const startDay = monthStart.value.getDay()
  const firstCellDate = new Date(monthStart.value)
  firstCellDate.setDate(firstCellDate.getDate() - startDay)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstCellDate)
    date.setDate(firstCellDate.getDate() + index)

    const events = monthShortEvents.value
      .filter((event) => event.start <= date && event.end >= date)
      .slice()
      .sort(compareByStartDesc)
    return {
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      date,
      currentMonth: date.getMonth() === currentDate.value.getMonth(),
      events,
      overflow: events.length > 2 ? events.length - 2 : 0
    }
  })
})

function selectDate(date) {
  selectedDate.value = date
}

function prevMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

async function loadFestivalData() {
  try {
    festivalItems.value = await getByCategory('축제공연행사')
    console.log('FestivalCalendar loaded', festivalItems.value.length, 'items')
    console.log('Sample festival data:', festivalItems.value.slice(0, 3))
  } catch (error) {
    console.warn('FestivalCalendar: 축제 데이터를 가져오는 중 오류가 발생했습니다.', error)
  }
}

onMounted(() => {
  loadFestivalData()
})
</script>
