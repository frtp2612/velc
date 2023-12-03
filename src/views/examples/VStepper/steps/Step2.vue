<template>
  <div class="w-full h-full flex flex-col gap-4 min-h-0 overflow-auto">
    Step 2 component
    <div>{{ stateSource }}</div>
    <VButton :on-click="() => (stateSource.step2Cleared = true)"
      >Clear step</VButton
    >
  </div>
</template>

<script setup lang="ts">
import { StepperExampleStateType } from "../VStepperExample.vue";
import VButton from "@/components/VButton/index";

defineProps<{
  stateSource: StepperExampleStateType;
}>();
</script>

<style scoped></style>
