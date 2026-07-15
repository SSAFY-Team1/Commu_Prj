<template>
  <div class="space-y-5">
    <header>
      <p class="text-sm font-semibold text-brand-700">데이터 출처 및 라이선스</p>
      <h1 class="mt-1 text-2xl font-bold text-slate-900">한국관광공사 TourAPI 4.0 활용 안내</h1>
      <p class="mt-2 text-sm text-slate-600">의뢰서 기준에 따라 제공 JSON의 출처와 라이선스를 명시합니다.</p>
    </header>

    <section class="panel p-5">
      <dl class="grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt class="font-semibold text-slate-700">제공 기관</dt>
          <dd class="mt-1 text-slate-900">한국관광공사</dd>
        </div>
        <div>
          <dt class="font-semibold text-slate-700">데이터명</dt>
          <dd class="mt-1 text-slate-900">국문 관광정보 서비스(TourAPI 4.0)</dd>
        </div>
        <div>
          <dt class="font-semibold text-slate-700">권역</dt>
          <dd class="mt-1 text-slate-900">서울</dd>
        </div>
        <div>
          <dt class="font-semibold text-slate-700">라이선스</dt>
          <dd class="mt-1 text-slate-900">공공누리 제3유형: 출처 표시, 변경 금지</dd>
        </div>
      </dl>
    </section>

    <section class="panel overflow-hidden">
      <div class="border-b border-slate-200 px-5 py-4">
        <h2 class="font-bold text-slate-900">현재 앱 포함 데이터</h2>
        <p class="mt-1 text-sm text-slate-600">현재 저장소에 포함된 JSON 7개 파일 합산 기준입니다.</p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="px-5 py-3 font-semibold">파일</th>
              <th class="px-5 py-3 font-semibold">유형</th>
              <th class="px-5 py-3 text-right font-semibold">건수</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="row in rows" :key="row.file">
              <td class="px-5 py-3 text-slate-900">{{ row.file }}</td>
              <td class="px-5 py-3 text-slate-700">{{ row.category }}</td>
              <td class="px-5 py-3 text-right text-slate-900">{{ row.count.toLocaleString() }}</td>
            </tr>
          </tbody>
          <tfoot class="bg-slate-50 font-bold">
            <tr>
              <td class="px-5 py-3" colspan="2">합계</td>
              <td class="px-5 py-3 text-right">{{ total.toLocaleString() }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const rows = [
  { file: '서울_관광지.json', category: '관광지', count: 783 },
  { file: '서울_문화시설.json', category: '문화시설', count: 566 },
  { file: '서울_축제공연행사.json', category: '축제공연행사', count: 201 },
  { file: '서울_여행코스.json', category: '여행코스', count: 51 },
  { file: '서울_레포츠.json', category: '레포츠', count: 126 },
  { file: '서울_숙박.json', category: '숙박', count: 423 },
  { file: '서울_쇼핑.json', category: '쇼핑', count: 4368 }
]

const total = computed(() => rows.reduce((sum, row) => sum + row.count, 0))
</script>
