import { ref } from "vue";

export type GraphPoint = {
	x: number;
	y: number;
	angle: number;
	value: number;
	tooltipText: string;
};

export function VEvaluationGraphState(
	points: number[],
	radius: number,
	center: number,
	pointsRadius: number
) {
	const angleBetweenPoints = ref(360 / points.length);

	const graphPoints = ref<GraphPoint[]>([]);

	const graphSize = radius * 4;
	const pointRadiusPercentageSize = (pointsRadius * 100) / graphSize;

	function init() {
		points.forEach((pointValue: number, index: number) => {
			const { angle, x, y } = getPointPosition(index, pointValue);

			graphPoints.value.push({
				x,
				y,
				angle,
				value: pointValue,
				tooltipText: "",
			});
		});
	}

	function getPointPosition(
		index: number,
		pointValue: number
	): {
		angle: number;
		x: number;
		y: number;
	} {
		const angle = (angleBetweenPoints.value * (index + 1) * Math.PI) / 180;
		// console.log(angle);

		const x =
			center + (radius - pointsRadius) * Math.sin(angle) * 0.5 * pointValue;
		const y =
			center + (radius - pointsRadius) * Math.cos(angle) * 0.5 * pointValue;
		return { angle, x: x, y: y };
	}

	init();

	return {
		graphPoints,
		angleBetweenPoints,
	};
}
