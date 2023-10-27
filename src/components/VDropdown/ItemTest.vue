<template>
  <div class="flex flex-col">
    <div class="flex gap-4">
      <span>{{ item }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  item: any;
}>();
</script>

<style scoped></style>
