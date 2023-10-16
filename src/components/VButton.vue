<template>
  <button>
    {{ text }}
    <slot />
  </button>
</template>
<script lang="ts" setup>
defineProps({
  text: String,
});
</script>
<style lang=""></style>
