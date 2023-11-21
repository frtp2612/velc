<template>
	<div class="grid grid-cols-5 gap-4 p-8">
		<div
			v-for="[key, value] in colorsMap"
			class="flex flex-col gap-4 bg-color-bg-50 rounded-xl p-4"
		>
			<div
				class="grid grid-cols-[1fr,_1fr,_auto] gap-4 bg-color-bg-100 p-2 rounded-lg items-center justify-between"
			>
				<VLabel class="text-lg font-semibold">{{ key }}</VLabel>
				<VLabel class="text-lg font-semibold">rgb({{ value.main }})</VLabel>
				<div
					class="justify-self-end w-8 h-8 aspect-auto border border-color-border-50 rounded-md cursor-pointer"
					:style="{ backgroundColor: `rgb(${value.main})` }"
					v-tooltip="{ text: value.main }"
				></div>
				<input type="color" @input="(event) => changeProperty(key, event)" />
			</div>

			<div class="flex flex-col gap-2 px-2">
				<div
					class="grid grid-cols-[1fr,_1fr,_auto] gap-4 items-center justify-between"
					v-for="[derivedKey, derivedValue] in value.derived"
				>
					<VLabel class="text-lg font-semibold">{{ derivedKey }}</VLabel>
					<VLabel class="text-lg font-semibold">rgb({{ derivedValue }})</VLabel>
					<div
						class="justify-self-end w-8 h-8 aspect-auto border border-color-border-50 rounded-md cursor-pointer"
						:style="{ backgroundColor: `rgb(${derivedValue})` }"
					></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import VLabel from "@/components/VLabel/index";
import { ref } from "vue";

const colorsMap = ref<
	Map<string, { main: string; derived: Map<string, string> }>
>(new Map());
console.log(
	document.body
		.computedStyleMap()
		.forEach((value: CSSStyleValue[], key: string) => {
			if (key.startsWith("--color")) {
				if (!key.endsWith("0")) {
					// main colors are the
					if (!colorsMap.value.has(key)) {
						colorsMap.value.set(key.replace("--color-", ""), {
							main: value[0].toString(),
							derived: new Map(),
						});
					}
				} else {
					const main = key.replace("--color-", "");
					colorsMap.value
						.get(main.split("-")[0])
						?.derived.set(
							main.replace(main.split("-")[0] + "-", ""),
							value[0].toString()
						);
				}
			}
		})
);

function changeProperty(key: string, event: Event) {
	const updatedColor = hexToRgb((event.target as HTMLInputElement)?.value);
	console.log();
	document.body.style.setProperty(
		"--color-" + key,
		`${updatedColor?.r} ${updatedColor?.g} ${updatedColor?.b}`
	);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: null;
}
</script>
