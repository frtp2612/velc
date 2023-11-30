<template>
	<div
		class="flex gap-4 p-2 h-full border hover:border-color-primary cursor-pointer rounded-lg items-center"
		:class="[
			active
				? 'bg-color-secondary-50 border-color-secondary-100'
				: 'bg-color-bg-50 border-transparent',
		]"
	>
		<div class="h-full w-auto aspect-square">
			<div
				class="w-full aspect-square cursor-pointer rounded-lg border border-color-border-50"
				:style="{ backgroundColor: `${color}` }"
			></div>
		</div>
		<VLabel class="text-lg font-semibold">{{ name }}</VLabel>
	</div>
</template>

<script setup lang="ts">
// import VColorPicker from "@/components/VColorPicker/VColorPicker.vue";
import VLabel from "@/components/VLabel/index";
import { ref } from "vue";

const props = defineProps<{
	value: string;
	name: string;
	active: boolean;
	// onValueChanged: (
	//   key: string,
	//   newValue: string,
	//   hue: number,
	//   saturation: number
	// ) => void;
}>();

// const colorPicker = ref<InstanceType<typeof VColorPicker>>();

const color = ref(props.value);

// function onColorChanged(newValue: string) {
//   props.onValueChanged(
//     props.name,
//     newValue,
//     colorPicker.value!.hue,
//     colorPicker.value!.saturation
//   );
// }
</script>

<style scoped></style>
