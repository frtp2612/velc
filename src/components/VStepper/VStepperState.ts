import { VStep } from "@/enums/index";
import { Ref, computed, ref } from "vue";

export function VStepperState(
	stepper: Ref<HTMLElement | null>,
	steps: VStep[]
) {
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
		return (
			!visibleSteps.value[index].enablingCondition ||
			(visibleSteps.value[index].enablingCondition &&
				visibleSteps.value[index].enablingCondition!())
		);
	}

	return {
		currentStep,
		activeStepIndex,

		visibleSteps,

		changeStep,
		stepEnabled,
	};
}
