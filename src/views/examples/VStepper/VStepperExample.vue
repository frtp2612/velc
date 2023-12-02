<template>
	<VStepper :steps="steps" :state-source="state"> </VStepper>
</template>

<script lang="ts" setup>
import VStepper from "@/components/VStepper/VStepper.vue";
import { VStep } from "@/enums/index";
import { ref } from "vue";
import Step1 from "./steps/Step1.vue";
import Step2 from "./steps/Step2.vue";
import Step3 from "./steps/Step3.vue";
import Step4 from "./steps/Step4.vue";

export type StepperExampleStateType = {
	step1Cleared: boolean;
	step2Cleared: boolean;
};

const state = ref({
	step1Cleared: false,
	step2Cleared: false,
});

const steps: VStep[] = [
	{
		title: "step 1",
		component: Step1,
	},
	{
		title: "step 2",
		component: Step2,
		enablingCondition: () => state.value.step1Cleared,
	},
	{
		title: "step 3",
		component: Step3,
		enablingCondition: () => state.value.step2Cleared,
	},
	{
		title: "step 4",
		component: Step4,
		visibilityCondition: () => state.value.step1Cleared,
	},
];
</script>
