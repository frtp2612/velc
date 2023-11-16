<template>
	<div
		class="cursor-pointer flex items-center justify-center gap-2"
		@click="toggleValue"
	>
		<div
			class="input-base !p-0 !h-[1.25rem] !w-[1.25rem] flex items-center justify-center aspect-square"
			:class="[checkboxClass]"
			tabindex="0"
		>
			<font-awesome-icon
				:icon="checkboxIcon"
				class="aspect-square w-2.5"
				v-if="checkboxIcon"
			/>
		</div>
		<VLabel class="font-medium" v-if="label">{{ label }}</VLabel>
	</div>
</template>

<script lang="ts" setup>
import VLabel from "@/components/VLabel/index";
import { useVModel } from "@vueuse/core";
import { computed, onMounted, ref } from "vue";

const props = defineProps<{
	id: string;
	modelValue?: any;
	customClass?: string;
	autoFocus?: boolean;
	resettable?: boolean;
	label?: string;
}>();

const emit = defineEmits(["update:modelValue", "onReset"]);

const model = useVModel(
	props,
	"modelValue",
	emit,
	props.modelValue
		? {}
		: {
				passive: true,
				defaultValue: null,
		  }
);

const input = ref<HTMLElement | null>(null);

function toggleValue() {
	if (props.resettable) {
		if (model.value === false) {
			model.value = null;
			emit("onReset");
		} else {
			model.value = !model.value;
		}
	} else {
		model.value = !model.value;
	}
}

const checkboxClass = computed(() => {
	if (model.value === true) {
		return "true";
	}

	if (model.value === false && props.resettable) {
		return "resettable-false text-color-text";
	}
	return "text-color-text";
});

const checkboxIcon = computed(() => {
	if (model.value === true) {
		return "fa-check";
	}

	if (model.value === false && props.resettable) {
		return "fa-solid fa-xmark";
	}
	return undefined;
});

onMounted(() => {
	if (props.autoFocus && input.value) {
		input.value.focus();
	}
});
</script>
