<template>
  <VStepper :steps="steps" :state-source="state"> </VStepper>
</template>

<script lang="ts" setup>
import VStepper from "@/components/VStepper/VStepper.vue";
import { VStep } from "@/enums/index";
import { ref, computed } from "vue";
import Step1 from "./steps/Step1.vue";
import Step2 from "./steps/Step2.vue";
import Step3 from "./steps/Step3.vue";
import Step4 from "./steps/Step4.vue";

export type StepperExampleStateType = {
  step1Cleared: boolean;
  step2Cleared: boolean;
  name: string;
  age: number;
};

const state = ref({
  step1Cleared: false,
  step2Cleared: false,
  name: "",
  age: 0,
});

const steps: VStep[] = [
  {
    title: "step 1",
    component: Step1,
    completionCondition: computed(() => state.value.step1Cleared),
  },
  {
    title: "step 2",
    component: Step2,
    completionCondition: computed(() => state.value.step2Cleared),
  },
  {
    title: "step 3",
    component: Step3,
    completionCondition: computed(() => state.value.name !== ""),
  },
  {
    title: "step 4",
    component: Step4,
    completionCondition: computed(() => state.value.age > 18),
    visibilityCondition: () => state.value.step1Cleared,
  },
];
</script>
