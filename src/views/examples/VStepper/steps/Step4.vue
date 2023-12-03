<template>
  <div class="w-full h-full flex flex-col gap-4 min-h-0 overflow-auto">
    Step 4 component
    <div>{{ stateSource }}</div>
    <VNumericField id="name" v-model="stateSource.age" />
  </div>
</template>

<script setup lang="ts">
import { StepperExampleStateType } from "../VStepperExample.vue";
import VNumericField from "@/components/VNumericField/VNumericField.vue";

defineProps<{
  stateSource: StepperExampleStateType;
}>();
</script>

<style scoped></style>
