<template>
	<div class="h-full min-h-0 grid grid-cols-[1fr,_3fr]" ref="stepper">
		<div
			class="h-full overflow-auto flex flex-col justify-between border-r border-color-border"
		>
			<div
				v-for="(step, index) in visibleSteps"
				class="p-2"
				@click="changeStep(index)"
				:class="[
					{ 'text-color-primary font-semibold': activeStepIndex === index },
					stepEnabled(index)
						? 'text-color-text-600 hover:text-color-primary'
						: 'text-color-text-400 cursor-not-allowed',
					{
						'cursor-pointer':
							!step.enablingCondition ||
							(step.enablingCondition && step.enablingCondition()) ||
							activeStepIndex === index,
					},
				]"
			>
				{{ step.title }}
			</div>
		</div>
		<VStepPanel
			:component="currentStep.component"
			:visibilityCondition="currentStep.visibilityCondition"
			:stateSource="stateSource"
		>
			{{ currentStep.title }}
		</VStepPanel>
	</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { VStep } from "../../enums/index";
import VStepPanel from "./VStepPanel.vue";
import { VStepperState } from "./VStepperState";

const props = defineProps<{
	steps: VStep[];
	stateSource?: Object | Function;
}>();

const stepper = ref<HTMLElement | null>(null);

const state = VStepperState(stepper, props.steps);
const { currentStep, activeStepIndex, visibleSteps, changeStep, stepEnabled } =
	state;
</script>
