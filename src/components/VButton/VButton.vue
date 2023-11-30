<template>
	<button
		class="inline-flex min-w-[2.5rem] min-h-[2.5rem] justify-center"
		:class="[buttonClass, { 'aspect-square': !$slots.default }]"
		@click="onClick && !disabled ? onClick() : {}"
	>
		<slot name="left"
			><font-awesome-icon
				:icon="iconLeft"
				class="h-5 w-5 text-color-inherit"
				v-if="iconLeft"
		/></slot>
		<VLabel v-if="$slots.default"><slot /></VLabel>
		<slot name="right"
			><font-awesome-icon
				:icon="iconRight"
				class="h-5 w-5 text-color-inherit"
				v-if="iconRight"
		/></slot>
	</button>
</template>
<script lang="ts" setup>
import VLabel from "@/components/VLabel/index";
import { VButtonTypes } from "@/enums/index";
import { computed } from "vue";

const props = withDefaults(
	defineProps<{
		onClick?: Function;
		iconLeft?: string;
		iconRight?: string;
		type?: VButtonTypes;
		disabled?: boolean;
	}>(),
	{
		disabled: false,
	}
);

const common =
	"px-4 py-1 cursor-pointer rounded-lg flex gap-2 items-center font-medium ";

const success =
	common + "bg-color-success hover:bg-color-success-400 text-color-text ";

const error =
	common + "bg-color-error hover:bg-color-error-400 text-color-text-50 ";

const buttonClass = computed(() => {
	let compoundClass = "";
	switch (props.type) {
		case VButtonTypes.PRIMARY:
			compoundClass = "btn-primary ";
			break;
		case VButtonTypes.SECONDARY:
			compoundClass = "btn-secondary ";
			break;
		case VButtonTypes.SUCCESS:
			compoundClass = success;
			break;
		case VButtonTypes.ERROR:
			compoundClass = error;
			break;
		default:
			compoundClass = "btn-base ";
			break;
	}

	if (props.disabled) {
		compoundClass +=
			"!bg-color-bg-100 !text-color-text-600 !cursor-not-allowed";
	}

	return compoundClass;
});
</script>
