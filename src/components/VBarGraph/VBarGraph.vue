<template>
	<div class="flex justify-center items-center h-full w-full">
		<div class="aspect-square relative h-full">
			<svg
				viewBox="0 0 100 100"
				class="w-full h-full aspect-square"
				xmlns="http://www.w3.org/2000/svg"
			>
				<line
					x1="0"
					y1="0"
					x2="0"
					y2="100"
					stroke-width="0.5%"
					class="stroke-black"
				/>
				<line
					x1="0"
					:y1="highestValue"
					:x2="100"
					:y2="highestValue"
					stroke-width="0.25%"
					class="stroke-black"
				/>
				<g>
					<line
						v-for="line in stepLines"
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
						v-for="line in stepLines"
						:x1="line.x1"
						:x2="line.x2"
						:y1="line.y1 + highestValue"
						:y2="line.y2 + highestValue"
						stroke-width="0.125%"
						class="stroke-color-border-100"
					/>
				</g>
				<g>
					<text x="0" :y="line.y1" v-for="line in stepLines">
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

const values = new Array(20)
	.fill(0)
	.map(
		() => Math.ceil(Math.random() * 199) * (Math.round(Math.random()) ? 1 : -1)
	);

const steps = 3;

const stepSize = 0.5;

const state = VBarGraphState(values, {
	steps,
	stepSize,
});

const { graphPoints, highestValue, stepLines, lineWidth, minY, init } = state;

onBeforeMount(() => {
	init();
});
</script>

<style></style>
