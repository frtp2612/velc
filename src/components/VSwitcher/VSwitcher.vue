<template>
	<div
		class="rounded-lg bg-color-bg-50 flex justify-evenly relative border border-color-border-50 hover:border-color-border-100"
		ref="switcherContainer"
	>
		<div
			class="bg-color-primary rounded-lg h-full w-[var(--switcher-width)] absolute top-0 left-0 translate-x-[var(--switcher-offset)] transition-transform"
			ref="switcher"
		></div>
		<div
			v-for="(value, index) in values"
			class="w-[var(--switcher-width)] z-10 font-semibold text-center px-4 py-2 cursor-pointer flex justify-center rounded-md"
			:class="[
				selectedValue === index
					? 'text-color-text-50'
					: 'text-color-text hover:text-color-secondary-500 hover:bg-color-bg-100',
			]"
			@click="switchTo(index, value.callback)"
		>
			<VSwitcherItem
				:formatter="formatter"
				:label="value.label"
				:icon="value.icon"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { VCallableItem } from "@/enums/index";
import { useVModel } from "@vueuse/core";
import { onMounted, ref } from "vue";
import VSwitcherItem from "./VSwitcherItem.vue";

const props = defineProps<{
	modelValue?: number;
	label?: string;
	values: VCallableItem[];
	formatter?: () => string;
}>();

const emit = defineEmits(["update:modelValue"]);

const switcher = ref<HTMLElement>();
const switcherContainer = ref<HTMLElement>();

const width = 100 / props.values.length;

const selectedValue = useVModel(
	props,
	"modelValue",
	emit,
	props.modelValue
		? {}
		: {
				passive: true,
				defaultValue: 0,
		  }
);

function switchTo(index: number, callback: Function) {
	selectedValue.value = index;
	requestAnimationFrame(() => updateSwitcherOffset());
	callback();
}

function updateSwitcherOffset() {
	switcherContainer.value?.style.setProperty(
		"--switcher-offset",
		selectedValue.value! * 100 + "%"
	);
}

onMounted(() => {
	switcherContainer.value?.style.setProperty("--switcher-width", width + "%");
	updateSwitcherOffset();
});
</script>
