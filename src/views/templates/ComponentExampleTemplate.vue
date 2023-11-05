<template>
  <div class="flex flex-col divide-y divide-color-border-100 h-full">
    <div class="p-4 font-bold text-2xl">{{ componentName }}</div>
    <div class="p-4 h-full min-h-0 overflow-auto">
      <div class="flex flex-col gap-4 h-full">
        <header class="font-semibold text-xl">Usage</header>
        <div class="flex flex-col gap-4 h-full">
          <slot name="usage"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  componentName: string;
}>();
</script>

<style scoped></style>
