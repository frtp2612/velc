<template>
  <div class="w-full h-full flex flex-col gap-4 min-h-0 overflow-auto">
    Step 1 component
    <div>{{ stateSource }}</div>
    <VButton :on-click="() => (stateSource.step1Cleared = true)"
      >Clear step</VButton
    >
  </div>
</template>

<script setup lang="ts">
import VButton from "@/components/VButton/index";
import { StepperExampleStateType } from "../VStepperExample.vue";

defineProps<{
  stateSource: StepperExampleStateType;
}>();
</script>

<style scoped></style>
