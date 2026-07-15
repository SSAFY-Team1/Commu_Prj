<template>
  <button
    :class="baseClasses + (disabled ? ' opacity-50 cursor-not-allowed' : '')"
    :disabled="disabled"
    @click="$emit('click')"
    type="button"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  disabled: { type: Boolean, default: false },
  variant: { type: String, default: 'primary' }
})

const baseClasses =
  'inline-flex items-center justify-center px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white'
</script>
