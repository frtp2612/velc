<template>
  <div class="w-full h-full flex flex-col gap-4 min-h-0 overflow-auto">
    Step 3 component
    <div>{{ stateSource }}</div>
    <VTextField id="name" v-model="stateSource.name" />
  </div>
</template>

<script setup lang="ts">
import { StepperExampleStateType } from "../VStepperExample.vue";
import VTextField from "@/components/VTextField/VTextField.vue";

defineProps<{
  stateSource: StepperExampleStateType;
}>();
</script>

<style scoped></style>
