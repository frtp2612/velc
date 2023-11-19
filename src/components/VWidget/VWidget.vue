<template>
  <div
    class="grid h-full w-full bg-white rounded-lg p-4 border border-color-border-50 flex-col grid-rows-[auto,_1fr]"
  >
    <VLabel class="font-semibold text-xl w-full">{{ name }}</VLabel>
    <div class="flex h-full min-h-0 justify-center items-center">
      <component :is="is"></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import VLabel from "@/components/VLabel/index";

const props = defineProps<{
  componentPath: string;
  name: string;
}>();

const is = computed(() =>
  defineAsyncComponent(() => import(`${props.componentPath}`))
);
</script>
