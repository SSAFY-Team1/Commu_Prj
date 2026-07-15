<template>
  <div class="p-4 bg-white rounded shadow flex flex-col">
    <div class="text-sm text-gray-500">{{ label }}</div>
    <div class="text-2xl font-bold mt-2">{{ value }}</div>
  </div>
</template>

<script setup>
const props = defineProps({ label: { type: String, required: true }, value: { type: [String, Number], default: '--' } })
</script>
