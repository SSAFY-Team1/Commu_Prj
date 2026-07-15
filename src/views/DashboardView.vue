<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    <p class="mb-4">차트 및 KPI 카드를 여기 배치합니다(샘플).</p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="p-4 bg-white rounded shadow">전체 콘텐츠 수<br/><strong>--</strong></div>
      <div class="p-4 bg-white rounded shadow">카테고리 수<br/><strong>--</strong></div>
      <div class="p-4 bg-white rounded shadow">게시글 수<br/><strong>--</strong></div>
    </div>

    <div class="mt-6 p-4 bg-white rounded shadow">
      <p>차트 자리(추후 Chart.js 연동)</p>
      <canvas id="chart" class="w-full h-64"></canvas>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    // Chart.js 연동은 필요 시 추가
  }
}
</script>
