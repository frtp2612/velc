<template>
  <div class="w-full h-full flex min-h-0">
    <component
      :is="component"
      v-if="visibilityCondition()"
      :stateSource="stateSource"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    component: Object;
    visibilityCondition?: () => boolean;
    stateSource?: Object | Function;
  }>(),
  {
    visibilityCondition: () => true,
  }
);
</script>

<style scoped></style>
