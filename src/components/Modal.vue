<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black/50" @click="close"></div>

      <div class="bg-white rounded max-w-lg w-full p-4 z-10">
        <header class="flex justify-between items-center">
          <slot name="header">
            <h3 class="text-lg font-semibold">Modal</h3>
          </slot>
          <button @click="close" aria-label="Close" class="text-gray-500">✕</button>
        </header>

        <div class="mt-3">
          <slot />
        </div>

        <footer class="mt-4">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
const props = defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue'])

function close() { emit('update:modelValue', false) }

function onKey(e) { if (e.key === 'Escape') close() }

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>
<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black/50" @click="close"></div>

      <div class="bg-white rounded max-w-lg w-full p-4 z-10">
        <header class="flex justify-between items-center">
          <slot name="header">
            <h3 class="text-lg font-semibold">Modal</h3>
          </slot>
          <button @click="close" aria-label="Close" class="text-gray-500">✕</button>
        </header>

        <div class="mt-3">
          <slot />
        </div>

        <footer class="mt-4">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
const props = defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue'])

function close() { emit('update:modelValue', false) }

function onKey(e) { if (e.key === 'Escape') close() }

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>