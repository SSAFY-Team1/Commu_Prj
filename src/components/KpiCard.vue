<template>
  <article class="panel p-4">
    <p class="text-sm font-semibold text-slate-500">{{ label }}</p>
    <p class="mt-2 text-3xl font-bold text-slate-900">{{ value }}</p>
    <p v-if="hint" class="mt-1 text-xs text-slate-500">{{ hint }}</p>
  </article>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], default: '--' },
  hint: { type: String, default: '' }
})
</script>
