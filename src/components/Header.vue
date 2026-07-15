<template>
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
      <router-link to="/" class="flex items-center gap-2" @click="open = false">
        <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white shadow-sm" aria-hidden="true">
          <svg class="h-6 w-6" viewBox="0 0 32 32" fill="none" focusable="false">
            <path
              d="M16 29s9-8.3 9-16.1A9 9 0 0 0 7 12.9C7 20.7 16 29 16 29Z"
              fill="currentColor"
            />
            <path d="M11.5 10.5h9v6.25h-4.05l-2.95 2.4v-2.4h-2a2 2 0 0 1-2-2V12.5a2 2 0 0 1 2-2Z" fill="#2563EB" />
            <circle cx="13.25" cy="13.65" r="0.8" fill="white" />
            <circle cx="16" cy="13.65" r="0.8" fill="white" />
            <circle cx="18.75" cy="13.65" r="0.8" fill="white" />
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
