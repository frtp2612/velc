<template>
  <button
    class="bg-color-primary px-4 py-2 cursor-pointer rounded-lg flex gap-2 items-center"
    @click="onClick ? onClick() : {}"
  >
    <slot name="left"> </slot>
    <slot />
    <slot name="right"> </slot>
  </button>
</template>
<script lang="ts" setup>
defineProps<{
  onClick?: Function;
}>();
</script>
