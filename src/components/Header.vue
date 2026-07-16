<template>
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
      <router-link to="/" class="flex items-center gap-2" @click="open = false">
        <span class="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200" aria-hidden="true">
          <img src="/favicon.ico" alt="" class="h-8 w-8 object-contain" />
        </span>
        <span>
          <span class="block text-base font-bold leading-tight text-slate-900">LocalHub 서울</span>
          <span class="block text-xs leading-tight text-slate-500">공공데이터 지역 정보 커뮤니티</span>
        </span>
      </router-link>

      <nav class="hidden items-center gap-1 md:flex" aria-label="주요 메뉴">
        <router-link v-for="item in navItems" :key="item.to" :to="item.to" class="nav-link">
          {{ item.label }}
        </router-link>
      </nav>

      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded border border-slate-200 text-slate-700 md:hidden"
        :aria-expanded="open"
        aria-controls="mobile-navigation"
        aria-label="메뉴 열기"
        @click="open = !open"
      >
        <span v-if="!open" aria-hidden="true">☰</span>
        <span v-else aria-hidden="true">×</span>
      </button>
    </div>

    <nav v-if="open" id="mobile-navigation" class="border-t border-slate-200 bg-white px-4 py-2 md:hidden" aria-label="모바일 메뉴">
      <router-link v-for="item in navItems" :key="item.to" :to="item.to" class="block rounded px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" @click="open = false">
        {{ item.label }}
      </router-link>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const open = ref(false)
const navItems = [
  { to: '/', label: '홈' },
  { to: '/category/all', label: '지역 정보' },
  { to: '/dashboard', label: '대시보드' },
  { to: '/community', label: '커뮤니티' },
  { to: '/festival-calendar', label: '축제 캘린더' }
]
</script>
