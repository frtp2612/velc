<template>
	<div
		class="grid grid-cols-[1fr,_1fr,_auto] gap-4 items-center justify-between"
	>
		<VLabel class="text-lg font-semibold">{{ name }}</VLabel>
		<VLabel class="text-lg font-semibold">{{ color }}</VLabel>
		<div class="flex gap-2 items-center">
			<div
				class="justify-self-end w-9 h-9 aspect-auto border border-color-border-100 rounded-md cursor-pointer"
				:style="{ backgroundColor: `${color}` }"
				v-tooltip="{ text: computed(() => color) }"
			></div>
			<VColorPicker
				v-model="color"
				@update:model-value="onValueChanged(name, color)"
			/>
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
	onValueChanged: (key: string, newValue: string) => void;
}>();

const color = ref(props.value);
</script>

<style scoped></style>
