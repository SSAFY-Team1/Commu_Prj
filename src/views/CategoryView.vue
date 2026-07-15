<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Category: {{ id }}</h1>
    <p>카테고리별 상세 뷰(샘플)</p>
  </div>
</template>

<script>
export default {
  props: ['id']
}
</script>
