<template>
	<div class="flex justify-center items-center h-full w-full">
		<div class="aspect-square relative h-full">
			<svg
				viewBox="0 0 100 100"
				class="w-full h-full aspect-square"
				xmlns="http://www.w3.org/2000/svg"
			>
				<!-- axes -->
				<g class="stroke-black">
					<line
						:x1="yAxis.x1"
						:y1="yAxis.y1"
						:x2="yAxis.x2"
						:y2="yAxis.y2"
						stroke-width="0.25%"
					/>
					<line
						:x1="xAxis.x1"
						:y1="xAxis.y1"
						:x2="xAxis.x2"
						:y2="xAxis.y2"
						stroke-width="0.125%"
					/>
				</g>

				<!-- step lines -->
				<g>
					<line
						v-for="line in stepLinesAbove0"
						:x1="line.x1"
						:x2="line.x2"
						:y1="line.y1"
						:y2="line.y2"
						stroke-width="0.125%"
						class="stroke-color-border-100"
					/>
				</g>
				<g v-if="minY < 0">
					<line
						v-for="line in stepLinesBelow0"
						:x1="line.x1"
						:x2="line.x2"
						:y1="line.y1"
						:y2="line.y2"
						stroke-width="0.125%"
						class="stroke-color-border-100"
					/>
				</g>
				<g>
					<text x="0" :y="minY < 0 ? 50 : 100 - marginY" class="text-[0.2rem]">
						0
					</text>
					<text
						x="0"
						:y="line.y1 + 1"
						v-for="line in stepLinesAbove0"
						class="text-[0.2rem]"
					>
						{{ line.value }}
					</text>
				</g>
				<g v-if="minY < 0">
					<text
						v-for="line in stepLinesBelow0"
						x="0"
						:y="line.y1 + 1"
						class="text-[0.2rem]"
					>
						{{ line.value }}
					</text>
				</g>
				<!-- <path stroke="red" :d="`M0 ${yAxisMaxY} l100 0`" /> -->
			</svg>
			<svg
				viewBox="0 0 100 100"
				class="absolute top-0 left-0 h-full w-full"
				xmlns="http://www.w3.org/2000/svg"
			>
				<rect
					v-for="point in graphPoints"
					:width="lineWidth"
					:height="point.value"
					:x="point.x"
					:y="point.y"
					v-tooltip:top="{ text: point.tooltipText }"
					:class="[point.negative ? 'fill-color-error' : 'fill-color-primary']"
				/>
			</svg>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onBeforeMount } from "vue";
import { VBarGraphState } from "./VBarGraphState";

const values = new Array(10)
	.fill(0)
	.map(
		() =>
			Math.ceil(Math.random() * 19999) * (Math.round(Math.random()) ? 1 : -1)
	);

const steps = 6;

const stepSize = 0.5;

const marginY = 5;

const state = VBarGraphState(
	values,
	{
		steps,
		stepSize,
	},
	{
		y: marginY,
		x: 10,
	}
);

const {
	graphPoints,
	yAxis,
	xAxis,
	stepLinesAbove0,
	stepLinesBelow0,
	lineWidth,
	minY,
	init,
} = state;

onBeforeMount(() => {
	init();
});
</script>

<style></style>
