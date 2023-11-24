<template>
	<div class="flex flex-col items-center">
		<div class="w-full p-4 h-auto">
			<div
				class="w-full aspect-square cursor-pointer rounded-lg border border-color-border-50"
				:style="{ backgroundColor: `${color}` }"
				v-tooltip="{ text: computed(() => value) }"
			></div>
		</div>
		<div class="flex justify-between items-center gap-4 w-full px-4 py-2">
			<VLabel class="text-lg font-semibold">{{ name }}</VLabel>
			<div class="flex gap-2 items-center">
				<VColorPicker
					v-model="color"
					@update:model-value="onColorChanged"
					ref="colorPicker"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import VColorPicker from "@/components/VColorPicker/VColorPicker.vue";
import VLabel from "@/components/VLabel/index";
import { computed, ref } from "vue";

const props = defineProps<{
	value: string;
	name: string;
	onValueChanged: (
		key: string,
		newValue: string,
		hue: number,
		saturation: number
	) => void;
}>();

const colorPicker = ref<InstanceType<typeof VColorPicker>>();

const color = ref(props.value);

function onColorChanged(newValue: string) {
	props.onValueChanged(
		props.name,
		newValue,
		colorPicker.value!.hue,
		colorPicker.value!.saturation
	);
}
</script>

<style scoped></style>
