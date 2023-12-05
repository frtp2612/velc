<template>
	<div class="h-full min-h-0 grid grid-cols-[1fr,_3fr] relative" ref="stepper">
		<div class="absolute top-0 h-full left-0 p-3.5">
			<div class="w-2 h-full bg-color-bg-100"></div>
		</div>
		<div
			class="h-full min-h-0 overflow-auto flex flex-col justify-between border-r border-color-border"
		>
			<div
				v-for="(step, index) in visibleSteps"
				class="p-2 flex gap-4 items-center relative"
				@click="changeStep(index)"
				:class="[
					{
						'text-color-primary hover:text-color-primary font-semibold':
							activeStepIndex === index,
					},
					stepEnabled(index)
						? 'text-color-text-600 hover:text-color-text'
						: 'text-color-text-400 cursor-not-allowed',
					{
						'cursor-pointer': stepEnabled(index) || activeStepIndex === index,
					},
				]"
			>
				<div
					class="h-5 w-5 rounded-full flex"
					:class="[
						stepCompleted(index) &&
						stepEnabled(index) &&
						activeStepIndex !== index
							? 'bg-color-success'
							: 'bg-color-bg-100',
						{ 'bg-color-primary': activeStepIndex === index },
					]"
				>
					<!-- <font-awesome-icon icon="fa-check" class="w-5 h-5" /> -->
				</div>
				<VLabel>{{ step.title }}</VLabel>
			</div>
		</div>
		<div class="grid grid-rows-[1fr,_auto] p-6 gap-6">
			<VStepPanel
				:component="currentStep.component"
				:visibilityCondition="currentStep.visibilityCondition"
				:stateSource="stateSource"
			>
				{{ currentStep.title }}
			</VStepPanel>
			<VButton v-if="allStepsCompleted">Submit</VButton>
		</div>
	</div>
</template>

<script lang="ts" setup>
import VButton from "@/components/VButton/index";
import VLabel from "@/components/VLabel/index";
import { ref } from "vue";
import { VStep } from "../../enums/index";
import VStepPanel from "./VStepPanel.vue";
import { VStepperState } from "./VStepperState";

const props = defineProps<{
	steps: VStep[];
	stateSource?: Object | Function;
}>();

const stepper = ref<HTMLElement | null>(null);

const state = VStepperState(props.steps);
const {
	currentStep,
	activeStepIndex,
	visibleSteps,
	changeStep,
	allStepsCompleted,
	stepEnabled,
	stepCompleted,
} = state;
</script>
