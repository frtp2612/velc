import { ref } from "vue";

import { GraphPoint } from "@/components/VBarGraph/VBarGraphState";

export type EvaluationGraphPoint = GraphPoint & {
	angle: number;
};

export function VEvaluationGraphState(
	points: number[],
	radius: number,
	center: number,
	pointsRadius: number
) {
	const angleBetweenPoints = ref(360 / points.length);

	const graphPoints = ref<EvaluationGraphPoint[]>([]);

	const normalDistribution = ref<Map<number, EvaluationGraphPoint[]>>(
		new Map()
	);

	// const graphSize = radius * 4;
	// const pointRadiusPercentageSize = (pointsRadius * 100) / graphSize;

	const minRadius = 1;

	function init() {
		const maxRadius = Math.max(...points);

		points.forEach((pointValue: number, index: number) => {
			const { angle, x, y } = getPointPosition(index, pointValue, maxRadius);

			graphPoints.value.push({
				x,
				y,
				angle,
				value: pointValue,
				tooltipText: `${pointValue}`,
			});
		});

		for (let index = 1; index <= maxRadius; index++) {
			const normalizedPoints = points.map(
				(_value: number, localIndex: number) => {
					const { angle, x, y } = getPointPosition(
						localIndex,
						index,
						maxRadius
					);

					return {
						x,
						y,
						angle,
						value: index,
						tooltipText: ``,
					};
				}
			);

			normalDistribution.value.set(index, normalizedPoints);
		}

		console.log(normalDistribution.value);
	}

	function getPointPosition(
		index: number,
		pointValue: number,
		maxRadius: number
	): {
		angle: number;
		x: number;
		y: number;
	} {
		const angle = (angleBetweenPoints.value * (index + 1) * Math.PI) / 180;
		// console.log(angle);

		const minX = Math.sin(angle) * minRadius;
		const minY = Math.cos(angle) * minRadius;

		// maxRadius : 100 = pointValue : x;

		const position = pointValue / maxRadius;

		const x =
			minX +
			center +
			(radius - pointsRadius) * Math.sin(angle) * 0.5 * position;
		const y =
			minY +
			center +
			(radius - pointsRadius) * Math.cos(angle) * 0.5 * position;
		return { angle, x: x, y: y };
	}

	init();

	return {
		graphPoints,
		angleBetweenPoints,
		normalDistribution,
	};
}
