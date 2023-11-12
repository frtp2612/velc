<template>
  <component :is="component">
    <slot></slot>
  </component>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    component?: string;
  }>(),
  {
    component: "p",
  }
);
</script>
