<template>
  <button
    :type="type"
    :class="classes"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' }
})

defineEmits(['click'])

const variants = {
  primary: 'bg-brand-500 text-white hover:bg-brand-700 focus:ring-brand-300',
  secondary: 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 focus:ring-slate-200',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-200'
}

const classes = computed(() => [
  'inline-flex items-center justify-center rounded px-4 py-2 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2',
  variants[props.variant] || variants.primary,
  props.disabled ? 'cursor-not-allowed opacity-50' : ''
])
</script>
