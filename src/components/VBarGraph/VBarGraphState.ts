import { getNumberMagnitude, round, roundNumberToMagnitude } from "@/utilities";
import { ComputedRef, computed, ref } from "vue";

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
};

export type GraphStepLine = GraphLine & {
	value: number;
};

export function VBarGraphState(
	values: number[],
	stepOptions: { steps: number; stepSize: number },
	margins: {
		y: number;
		x: number;
	}
) {
	const minY = computed(() => Math.min(...values));
	const maxY = computed(() =>
		Math.max(...values.map((value) => Math.abs(value)))
	);

	const yAxisMin = computed(() => (minY.value < 0 ? -50 : -margins.y));
	const yAxisMax = computed(() => (minY.value < 0 ? 50 : 100) - margins.y);

	const graphPoints = ref<BarGraphPoint[]>();

	const lineWidth = computed(() => (50 - margins.x) / values.length);

	const highestValue = computed(() =>
		roundNumberToMagnitude(maxY.value, getNumberMagnitude(maxY.value))
	);

	const yAxis: ComputedRef<GraphLine> = computed(() => {
		return {
			x1: margins.x,
			x2: margins.x,
			y1: margins.y,
			y2: 100 - margins.y,
		};
	});

	const xAxis: ComputedRef<GraphLine> = computed(() => {
		return {
			x1: margins.x,
			x2: 100 - margins.x,
			y1: minY.value < 0 ? 50 : 100 - margins.y,
			y2: minY.value < 0 ? 50 : 100 - margins.y,
		};
	});

	const stepLinesAbove0 = computed<GraphStepLine[]>(() =>
		Array.from(Array(stepOptions.steps))
			.filter((_value, index) => index > 0)
			.map((_value, index) => {
				// get step as a Y percentage
				const stepPercentage =
					(100 / stepOptions.steps) * (stepOptions.steps - (index + 1));
				// use step percentage to get the real position of the step
				const stepYPosition =
					(100 - stepPercentage) *
					0.01 *
					(minY.value < 0 ? 50 - margins.y : 100 - 2 * margins.y);
				// console.log("step percentage: ", stepYPosition);
				// console.log(stepPercentage);

				const realStepValue =
					((minY.value < 0 ? 50 : 100) / stepOptions.steps) * (index + 1);
				return {
					x1: margins.x,
					x2: 100 - margins.x,
					y1: stepYPosition + margins.y,
					y2: stepYPosition + margins.y,
					value: round(
						(100 - realStepValue * (minY.value < 0 ? 2 : 1)) *
							0.01 *
							highestValue.value,
						1
					),
				};
			})
			.concat({
				x1: margins.x,
				x2: 100 - margins.x,
				y1: margins.y,
				y2: margins.y,
				value: highestValue.value,
			})
	);

	const stepLinesBelow0 = computed<GraphStepLine[]>(() =>
		Array.from(Array(stepOptions.steps))
			.filter((_value, index) => index > 0)
			.map((_value, index) => {
				// const maxGraphValue = Math.ceil((1 + stepOptions.stepSize) * maxY.value);
				// const stepGraph = maxGraphValue / stepOptions.steps;
				const stepValue = (yAxisMax.value / stepOptions.steps) * (index + 1);
				const realStepValue =
					((minY.value < 0 ? 50 : 100) / stepOptions.steps) * (index + 1);
				return {
					x1: margins.x,
					x2: 100 - margins.x,
					y1: 100 - stepValue - margins.y,
					y2: 100 - stepValue - margins.y,
					value: round(
						(100 - realStepValue * 2) * 0.01 * highestValue.value,
						1
					),
				};
			})
			.concat({
				x1: margins.x,
				x2: 100 - margins.x,
				y1: 100 - margins.y,
				y2: 100 - margins.y,
				value: highestValue.value,
			})
	);

	function init() {
		graphPoints.value = values.map((value, index) => {
			const normalizedValue = normalizeValue(value);

			return {
				x: index * 2 * lineWidth.value + margins.x,
				y:
					value < 0
						? 50
						: yAxisMax.value -
						  normalizedValue +
						  (minY.value < 0 ? margins.y : 0),
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
				(value * (100 - margins.y + (highestValue.value > 0 ? -50 : 0))) /
				-highestValue.value;
		} else if (value > 0) {
			normalizedValue =
				(value * (100 - margins.y + yAxisMin.value)) / highestValue.value;
		}

		return normalizedValue;
	}

	return {
		init,
		graphPoints,
		lineWidth,
		minY,
		maxY,
		yAxisMin,
		yAxisMax,
		stepLinesAbove0,
		stepLinesBelow0,
		highestValue,
		yAxis,
		xAxis,
	};
}
