<template>
  <div class="space-y-5">
    <header>
      <p class="text-sm font-semibold text-brand-700">데이터 출처 및 라이선스</p>
      <h1 class="mt-1 text-2xl font-bold text-slate-900">제공 JSON 활용 현황</h1>
      <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
        의뢰서 기준에 따라 사전 수집·가공된 서울 권역 JSON 파일을 프론트엔드에서 직접 로딩합니다.
        별도 공공 API 호출이나 백엔드 서버 없이 현재 포함 데이터만으로 지역 정보 탐색 기능을 제공합니다.
      </p>
    </header>

    <section class="panel p-5">
      <dl class="grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt class="font-semibold text-slate-700">제공 기관</dt>
          <dd class="mt-1 text-slate-900">한국관광공사</dd>
        </div>
        <div>
          <dt class="font-semibold text-slate-700">데이터명</dt>
          <dd class="mt-1 text-slate-900">국문 관광정보 서비스_GW</dd>
        </div>
        <div>
          <dt class="font-semibold text-slate-700">수집 권역</dt>
          <dd class="mt-1 text-slate-900">서울</dd>
        </div>
        <div>
          <dt class="font-semibold text-slate-700">앱 제공 방식</dt>
          <dd class="mt-1 text-slate-900">정적 JSON 파일 로딩</dd>
        </div>
        <div>
          <dt class="font-semibold text-slate-700">출처 URL</dt>
          <dd class="mt-1">
            <a
              class="font-semibold text-brand-700 hover:underline"
              href="https://www.data.go.kr/data/15101578/openapi.do"
              target="_blank"
              rel="noreferrer"
            >
              공공데이터포털 상세 페이지
            </a>
          </dd>
        </div>
        <div>
          <dt class="font-semibold text-slate-700">수집일</dt>
          <dd class="mt-1 text-slate-900">2026-07-15</dd>
        </div>
        <div>
          <dt class="font-semibold text-slate-700">이용허락범위</dt>
          <dd class="mt-1 text-slate-900">제한 없음</dd>
        </div>
        <div>
          <dt class="font-semibold text-slate-700">공공누리/이미지 유의사항</dt>
          <dd class="mt-1 text-slate-900">제공 이미지의 명예훼손, 인격권 침해, CI/BI 용도 사용 금지</dd>
        </div>
      </dl>
    </section>

    <section class="panel overflow-hidden">
      <div class="border-b border-slate-200 px-5 py-4">
        <h2 class="font-bold text-slate-900">활용 데이터 목록</h2>
        <p class="mt-1 text-sm text-slate-600">
          현재 저장소에 포함된 서울 권역 JSON 7개 파일 기준입니다. 제공 JSON 외 추가 데이터는 사용하지 않았습니다.
        </p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600">
            <tr>
              <th class="px-5 py-3 font-semibold">파일</th>
              <th class="px-5 py-3 font-semibold">유형</th>
              <th class="px-5 py-3 font-semibold">출처</th>
              <th class="px-5 py-3 font-semibold">수집일</th>
              <th class="px-5 py-3 text-right font-semibold">건수</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="row in rows" :key="row.file">
              <td class="px-5 py-3 text-slate-900">{{ row.file }}</td>
              <td class="px-5 py-3 text-slate-700">{{ row.category }}</td>
              <td class="px-5 py-3 text-slate-700">{{ row.source }}</td>
              <td class="px-5 py-3 text-slate-700">{{ row.collectedAt }}</td>
              <td class="px-5 py-3 text-right text-slate-900">{{ row.count.toLocaleString() }}</td>
            </tr>
          </tbody>
          <tfoot class="bg-slate-50 font-bold">
            <tr>
              <td class="px-5 py-3" colspan="4">합계</td>
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

const source = '한국관광공사 TourAPI 4.0'
const collectedAt = '2026-07-15'

const rows = [
  { file: '서울_관광지.json', category: '관광지', count: 783, source, collectedAt },
  { file: '서울_문화시설.json', category: '문화시설', count: 566, source, collectedAt },
  { file: '서울_축제공연행사.json', category: '축제공연행사', count: 201, source, collectedAt },
  { file: '서울_여행코스.json', category: '여행코스', count: 51, source, collectedAt },
  { file: '서울_레포츠.json', category: '레포츠', count: 126, source, collectedAt },
  { file: '서울_숙박.json', category: '숙박', count: 423, source, collectedAt },
  { file: '서울_쇼핑.json', category: '쇼핑', count: 4368, source, collectedAt }
]

const total = computed(() => rows.reduce((sum, row) => sum + row.count, 0))
</script>
