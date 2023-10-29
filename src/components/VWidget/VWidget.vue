<template>
  <div class="h-full w-full bg-white rounded p-2">
    <component :is="is"></component>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";

const props = defineProps<{
  componentPath: string;
}>();

const is = computed(() =>
  defineAsyncComponent(() => import(`${props.componentPath}`))
);
</script>
