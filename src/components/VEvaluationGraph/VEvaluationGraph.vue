<template>
	<div class="flex justify-center items-center h-full w-full">
		<div class="aspect-square relative h-full">
			<svg
				viewBox="0 0 100 100"
				class="absolute top-0 left-0 w-full h-full aspect-square z-0"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g v-for="[_index, points] in normalDistribution">
					<polygon
						:points="points.map((point: EvaluationGraphPoint) => `${point.x}, ${point.y}`).join(' ')"
						class="fill-none stroke-color-bg-50 stroke-1"
					/>
				</g>
			</svg>
			<svg
				class="fill-color-primary absolute top-0 left-0 w-full h-full aspect-square z-[1]"
				viewBox="0 0 100 100"
			>
				<circle
					v-for="point in graphPoints"
					:cx="`${point.x}`"
					:cy="`${point.y}`"
					:r="pointsSize"
					fill="current-color"
					v-tooltip="{ text: computed(() => point.tooltipText) }"
					class="origin-center hover:stroke-0 stroke-1 stroke-color-bg-100 duration-150"
				/>
			</svg>
			<svg
				viewBox="0 0 100 100"
				class="h-full w-full"
				xmlns="http://www.w3.org/2000/svg"
			>
				<polygon
					:points="graphPoints.map((point: EvaluationGraphPoint) => `${point.x}, ${point.y}`).join(' ')"
					class="fill-none stroke-color-bg-100 stroke-2"
				/>
			</svg>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import {
	EvaluationGraphPoint,
	VEvaluationGraphState,
} from "./VEvaluationGraphState";
//translate: `${point.x}% ${point.y}%`,
const points = [4, 1, 3, 2, 5, 4];
// const points = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const radius = 100 - 3;
const pointsSize = 3;
const center = 50;

// const graphSize = radius * 4;

const state = VEvaluationGraphState(points, radius, center, pointsSize);

const { graphPoints, normalDistribution } = state;
</script>

<style></style>
