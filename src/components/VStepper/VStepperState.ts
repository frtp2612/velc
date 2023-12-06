import { VStep } from "@/enums/index";
import { computed, ref } from "vue";

export function VStepperState(steps: VStep[]) {
	const activeStepIndex = ref(0);

	const visibleSteps = computed(() =>
		steps.filter((step: VStep) =>
			step.visibilityCondition ? step.visibilityCondition() : true
		)
	);

	const currentStep = computed(() => visibleSteps.value[activeStepIndex.value]);

	function changeStep(index: number) {
		if (stepEnabled(index)) {
			activeStepIndex.value = index;
		}
	}

	function stepEnabled(index: number) {
		if (index === 0) return true;
		return stepCompleted(index - 1);
	}

	function stepCompleted(index: number) {
		return visibleSteps.value[index].completionCondition
			? visibleSteps.value[index].completionCondition!()
			: true;
	}

	const allStepsCompleted = computed(() =>
		visibleSteps.value.every((_, index: number) => stepCompleted(index))
	);

	return {
		currentStep,
		activeStepIndex,

		visibleSteps,

		changeStep,
		stepEnabled,
		stepCompleted,

		allStepsCompleted,
	};
}
