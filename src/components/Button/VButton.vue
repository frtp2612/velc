<template>
  <button class="bg-red-300">
    {{ text }}
    <slot />
  </button>
</template>
<script lang="ts" setup>
defineProps({
  text: String,
});
</script>
