<template>
  <section class="panel mx-auto max-w-2xl p-8 text-center">
    <p class="text-sm font-semibold text-brand-700">404</p>
    <h1 class="mt-2 text-3xl font-bold text-slate-900">페이지를 찾을 수 없습니다</h1>
    <p class="mt-3 text-sm text-slate-600">주소가 잘못되었거나 이동된 페이지입니다.</p>
    <div class="mt-6 flex justify-center gap-3">
      <router-link to="/" class="rounded bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">홈으로</router-link>
      <router-link to="/category/all" class="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100">지역 정보 보기</router-link>
    </div>
  </section>
</template>
