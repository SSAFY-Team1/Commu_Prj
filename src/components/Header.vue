<template>
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
      <router-link to="/" class="flex items-center gap-2" @click="open = false">
        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white shadow-sm" aria-hidden="true">
          <svg class="h-6 w-6" viewBox="0 0 32 32" fill="none" focusable="false">
            <circle cx="16" cy="16" r="4.5" fill="white" />
            <circle cx="7.5" cy="9" r="3.2" fill="white" opacity="0.92" />
            <circle cx="24.5" cy="9" r="3.2" fill="white" opacity="0.92" />
            <circle cx="8.5" cy="23.5" r="3.2" fill="white" opacity="0.92" />
            <circle cx="23.5" cy="23.5" r="3.2" fill="white" opacity="0.92" />
            <path d="M10.2 10.8 13.1 13M21.8 10.8 18.9 13M11.2 21.7 13.1 19M20.8 21.7 18.9 19" stroke="white" stroke-width="2.2" stroke-linecap="round" />
            <circle cx="16" cy="16" r="2" fill="#2563eb" />
          </svg>
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
  { to: '/community', label: '커뮤니티' }
]
</script>
