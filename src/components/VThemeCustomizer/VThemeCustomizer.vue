<template>
	<div class="grid grid-cols-5 md:grid-cols-2 gap-4 p-8">
		<div
			v-for="[key, value] in colorsMap"
			class="flex flex-col gap-4 bg-color-bg-50 rounded-xl p-4"
		>
			<VThemeCustomizerColor
				:key="key"
				:name="key"
				:value="value.main"
				:on-value-changed="changeProperty"
				class="bg-color-bg-100 p-2 rounded-md"
			/>

			<div class="flex flex-col gap-2 px-2">
				<VThemeCustomizerColor
					v-for="[derivedKey, derivedValue] in value.derived"
					:key="derivedKey"
					:name="key + '-' + derivedKey"
					:value="derivedValue"
					:on-value-changed="changeProperty"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { toRGBObject } from "../../utilities/index";
import VThemeCustomizerColor from "./VThemeCustomizerColor.vue";

const colorsMap = ref<
	Map<string, { main: string; derived: Map<string, string> }>
>(new Map());
document.body
	.computedStyleMap()
	.forEach((value: CSSStyleValue[], key: string) => {
		if (key.startsWith("--color")) {
			const main = key.replace("--color-", "");

			if (!key.endsWith("0")) {
				// main colors are the
				if (!colorsMap.value.has(key)) {
					colorsMap.value.set(main, {
						main: `rgb(${value[0].toString()})`,
						derived: new Map(),
					});
				}
			} else {
				colorsMap.value
					.get(main.split("-")[0])
					?.derived.set(
						main.replace(main.split("-")[0] + "-", ""),
						`rgb(${value[0].toString()})`
					);
			}
		}
	});

function changeProperty(key: string, newValue: string) {
	const updatedColor = toRGBObject(newValue);
	// console.log(updatedColor);
	document.body.style.setProperty(
		"--color-" + key,
		`${updatedColor.r} ${updatedColor.g} ${updatedColor.b}`
	);
}
</script>
