<template>
	<div class="grid lg:grid-cols-8 md:grid-cols-4 gap-4 p-8">
		<div
			v-for="(value, key) in colorsMap"
			class="flex flex-col gap-4 bg-color-bg-50 rounded-xl overflow-hidden"
			:key="value"
		>
			<VThemeCustomizerColor
				:name="(key as string)"
				:value="value"
				:on-value-changed="changeProperty"
			/>

			<!-- <VThemeCustomizerColor
					v-for="[derivedKey, derivedValue] in value.derived"
					:key="derivedKey"
					:name="key + '-' + derivedKey"
					:value="derivedValue"
					:on-value-changed="changeProperty"
				/> -->
		</div>
	</div>
	<div
		class="fixed bottom-0 left-1/2 -translate-x-1/2 rounded-t-lg flex gap-4 bg-color-nav w-auto mx-auto justify-self-center p-4"
	>
		<div
			v-for="color in colors"
			:style="{ backgroundColor: `rgb(${color})` }"
			:key="color"
			v-tooltip:top="{ text: computed(() => `rgb(${color})`) }"
			class="w-8 h-8"
		></div>
	</div>
</template>

<script lang="ts" setup>
import { clamp } from "@vueuse/core";
import { computed, ref } from "vue";
import {
	HSLToRGB,
	RGBToHSL,
	getContrast,
	toRGBObject,
} from "../../utilities/index";
import VThemeCustomizerColor from "./VThemeCustomizerColor.vue";

const colorsMap = ref<{ [key: string]: string }>({});
const colors = ref<any[]>([]);

// const colorsMap = ref<
// 	Map<string, { main: string; derived: Map<string, string> }>
// >(new Map());
document.body
	.computedStyleMap()
	.forEach((value: CSSStyleValue[], key: string) => {
		if (key.startsWith("--color")) {
			const main = key.replace("--color-", "");

			if (!key.endsWith("0")) {
				colorsMap.value[main] = `rgb(${value[0].toString()})`;
				// if (!colorsMap.value.has(key)) {
				// 	colorsMap.value.set(main, {
				// 		main: `rgb(${value[0].toString()})`,
				// 		derived: new Map(),
				// 	});
				// }
			} else {
				// colorsMap.value
				// 	.get(main.split("-")[0])
				// 	?.derived.set(
				// 		main.replace(main.split("-")[0] + "-", ""),
				// 		`rgb(${value[0].toString()})`
				// 	);
			}
		}
	});

function changeProperty(
	key: string,
	newValue: string,
	colorHue: number,
	colorSaturation: number,
	updateColorsView: boolean = true
) {
	const updatedColor = toRGBObject(newValue);
	document.body.style.setProperty(
		"--color-" + key,
		`${updatedColor.r} ${updatedColor.g} ${updatedColor.b}`
	);

	const { l } = RGBToHSL(updatedColor.r, updatedColor.g, updatedColor.b);

	const newS = colorSaturation;
	const steps = 10;
	let lighterSteps = Math.round((100 - l) * 0.1);
	let darkerSteps = steps - lighterSteps;

	let darkenFactor = 100 / steps; // value in percentage
	let lightenFactor = 100 / steps; // value in percentage

	const contrast = getContrast(updatedColor, toRGBObject("rgb(0, 0, 0)"));
	if (updateColorsView) console.log(contrast);

	if (contrast > 5) {
		lighterSteps = 0;
		darkerSteps = steps;
		// lightenFactor = 12;
		// light theme
	} else if (contrast < 2) {
		lighterSteps = steps;
		darkerSteps = 0;
	}

	if (updateColorsView) console.log([lighterSteps, darkerSteps]);

	if (updateColorsView) colors.value.length = 0;
	Array.from(Array(lighterSteps).keys()).forEach((_, i: number) => {
		const hFactor = colorHue * lightenFactor * (lighterSteps - i) * 0.001;
		const lFactor = l * (lighterSteps - i) * lightenFactor * 0.02;
		// console.log(lFactor);

		const newH = clamp(colorHue - hFactor + Math.random() * 2, 0, 360);
		const newL = clamp(l + lFactor, 0, 100) * 0.01;
		// console.log([newH, newS, newL]);
		const rgb = HSLToRGB(newH, newS, newL);
		if (updateColorsView) colors.value.push(`${rgb.r} ${rgb.g} ${rgb.b}`);
	});

	Array.from(Array(darkerSteps).keys()).forEach((_, i: number) => {
		const hFactor = colorHue * darkenFactor * (i + 1) * 0.001;
		// const lFactor = l * (i + 1) * darkenFactor * 0.02;
		// const lFactor = l * 0.2 * Math.log10(i + 2);
		const lFactor = l * 0.5 * Math.log10(i + 2);
		console.log(
			"LOG ",
			l * Math.abs(1 / (10 - i) - 1 / 15) * 0.5 * Math.log10(i + 2)
		);
		console.log(lFactor);
		const newH = clamp(colorHue + hFactor, 0, 360);
		const newL = clamp(l - lFactor, 0, 100) * 0.01;
		// console.log([newH, newS, newL]);
		const rgb = HSLToRGB(newH, newS, newL);
		if (updateColorsView) colors.value.push(`${rgb.r} ${rgb.g} ${rgb.b}`);
	});

	console.log(colors.value);

	shades.forEach((shade: number, index: number) => {
		document.body.style.setProperty(
			"--color-" + key + "-" + shade,
			`${colors.value[index]}`
		);
	});

	if (key === "bg") {
		const textMainColor = colorsMap.value["text"];
		if (textMainColor) {
			if (contrast < 4.5) {
				changeProperty(
					"text",
					"rgb(255, 255, 255)",
					colorHue,
					colorSaturation,
					false
				);
				colorsMap.value["text"] = "rgb(255, 255, 255)";
			} else {
				changeProperty(
					"text",
					"rgb(0, 0, 0)",
					colorHue,
					colorSaturation,
					false
				);
				colorsMap.value["text"] = "rgb(0, 0, 0)";
			}
			// console.log(contrast);
		}
	}

	// console.log(colors.value);
}

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
</script>
