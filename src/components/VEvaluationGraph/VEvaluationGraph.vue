<template>
	<div class="flex justify-center items-center h-full w-full">
		<div class="aspect-square relative h-full">
			<svg
				width="100%"
				height="100%"
				class="fill-color-primary absolute top-0 left-0 w-full h-full aspect-square"
				viewBox="0 0 200 200"
			>
				<circle
					v-for="point in graphPoints"
					:cx="`${point.x}`"
					:cy="`${point.y}`"
					:r="pointsSize"
					fill="current-color"
					v-tooltip="{ text: point.tooltipText }"
					class="origin-center hover:scale-150 duration-150"
				/>
			</svg>
			<svg
				:view-box="`0 0 ${500} ${500}`"
				class="top-1/2 left-1/2 h-full w-full"
				xmlns="http://www.w3.org/2000/svg"
			>
				<polygon
					:points="graphPoints.map((point: GraphPoint) => `${point.x}, ${point.y}`).join(' ')"
					class="fill-none stroke-color-bg-100 stroke-2"
				/>
			</svg>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { GraphPoint, VEvaluationGraphState } from "./VEvaluationGraphState";
//translate: `${point.x}% ${point.y}%`,
const points = [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2];
// const points = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const radius = 50;
const pointsSize = 4;
const center = 100;

const graphSize = radius * 4;

const state = VEvaluationGraphState(points, radius, center, pointsSize);

const { graphPoints } = state;
</script>

<style>
circle:hover {
	r: 12;
}
</style>
