import { getNumberMagnitude, round, roundNumberToMagnitude } from "@/utilities";
import { computed, ref } from "vue";

export type GraphPoint = {
	x: number;
	y: number;
	value: number;
	tooltipText: string;
};

export type BarGraphPoint = GraphPoint & {
	negative: boolean;
};

export type GraphLine = {
	x1: number;
	x2: number;
	y1: number;
	y2: number;
	value: number;
};

export function VBarGraphState(
	values: number[],
	stepOptions: { steps: number; stepSize: number }
) {
	const minY = computed(() => Math.min(...values));
	const maxY = computed(() =>
		Math.max(...values.map((value) => Math.abs(value)))
	);

	const yAxisMinY = computed(() => (minY.value < 0 ? -50 : 0));
	const yAxisMaxY = computed(() => (minY.value < 0 ? 50 : 100));

	const graphPoints = ref<BarGraphPoint[]>();

	const lineWidth = computed(() => 50 / values.length);

	const highestValue = computed(() =>
		roundNumberToMagnitude(maxY.value, getNumberMagnitude(maxY.value))
	);

	const stepLines = computed<GraphLine[]>(() =>
		Array.from(Array(stepOptions.steps))
			.filter((_value, index) => index > 0)
			.map((_value, index) => {
				// const maxGraphValue = Math.ceil((1 + stepOptions.stepSize) * maxY.value);
				// const stepGraph = maxGraphValue / stepOptions.steps;
				const stepValue =
					((minY.value < 0 ? 50 : 100) / stepOptions.steps) * (index + 1);

				return {
					x1: 0,
					x2: 100,
					y1: stepValue,
					y2: stepValue,
					value: round((100 - stepValue * 2) * 0.01 * highestValue.value, 1),
				};
			})
	);

	function init() {
		graphPoints.value = values.map((value, index) => {
			const normalizedValue = normalizeValue(value);

			return {
				x: index * 2 * lineWidth.value,
				y: value < 0 ? 50 : (minY.value < 0 ? 50 : 100) - normalizedValue,
				value: normalizedValue,
				tooltipText: `${value}`,
				negative: value < 0,
			};
		});
	}

	function normalizeValue(value: number) {
		let normalizedValue = value;

		if (value < 0) {
			//minY : 100 = value : x
			normalizedValue =
				(value * (100 + (highestValue.value > 0 ? -50 : 0))) /
				-highestValue.value;
		} else if (value > 0) {
			normalizedValue =
				(value * (100 + (minY.value < 0 ? -50 : 0))) / highestValue.value;
		}

		return normalizedValue;
	}

	return {
		init,
		graphPoints,
		lineWidth,
		minY,
		maxY,
		yAxisMinY,
		yAxisMaxY,
		stepLines,
		highestValue,
	};
}
