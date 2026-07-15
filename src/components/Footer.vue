<template>
  <footer class="border-t border-slate-200 bg-white">
    <div class="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-sm text-slate-600 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
      <div>
        <p class="font-semibold text-slate-800">LocalHub 서울</p>
        <p>Vue 3 + Vite 기반 지역 정보 공유 커뮤니티 MVP</p>
      </div>
      <p class="max-w-2xl">
        이 서비스는 한국관광공사 TourAPI 4.0 데이터를 활용합니다.
        <router-link to="/data-source" class="font-semibold text-brand-700 hover:underline">데이터 출처 보기</router-link>
      </p>
    </div>
  </footer>
</template>
