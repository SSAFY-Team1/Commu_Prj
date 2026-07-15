<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center px-4 py-6" role="dialog" aria-modal="true">
      <button type="button" class="absolute inset-0 bg-slate-950/50" aria-label="모달 닫기" @click="close"></button>

      <section class="relative z-10 w-full max-w-lg rounded bg-white p-5 shadow-xl">
        <header class="flex items-start justify-between gap-4">
          <slot name="header">
            <h3 class="text-lg font-semibold text-slate-900">알림</h3>
          </slot>
          <button type="button" class="rounded px-2 text-xl leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-800" aria-label="닫기" @click="close">
            ×
          </button>
        </header>

        <div class="mt-4">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="mt-5 flex justify-end gap-2">
          <slot name="footer" />
        </footer>
      </section>
    </div>
  </transition>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'

defineProps({
  modelValue: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}

function onKey(event) {
  if (event.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>
