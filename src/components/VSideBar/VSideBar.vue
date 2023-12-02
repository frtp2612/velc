<template>
	<Transition name="slide-fade">
		<div
			class="h-full w-96 p-4 overflow-auto bg-color-nav border-color-border-50"
			:class="[sideBarClass]"
			v-show="isOpen"
			ref="sideBar"
		>
			<div class="flex justify-between gap-4">
				<slot name="title"
					><VLabel v-if="title">{{ title }}</VLabel></slot
				>
				<VButton
					icon-left="fa-xmark"
					class="ml-auto"
					:on-click="close"
				></VButton>
			</div>
			<slot></slot>
		</div>
	</Transition>
</template>

<script lang="ts" setup>
import VLabel from "@/components/VLabel/VLabel.vue";
import { useVModel } from "@vueuse/core";
import { computed, ref } from "vue";
import { HorizontalDirections } from "../../enums/index";
import VButton from "../VButton/index";

const props = withDefaults(
	defineProps<{
		title?: string;
		direction?: HorizontalDirections;
		modelValue?: boolean;
	}>(),
	{
		direction: HorizontalDirections.RIGHT,
	}
);

const sideBar = ref<HTMLElement | null>(null);

const emit = defineEmits(["update:modelValue"]);

const isOpen = useVModel(
	props,
	"modelValue",
	emit,
	props.modelValue
		? {}
		: {
				passive: true,
				defaultValue: false,
		  }
);

function close() {
	isOpen.value = false;
}

const sideBarClass = computed(() => {
	let finalClass = "";
	switch (props.direction) {
		case HorizontalDirections.RIGHT:
			finalClass += "border-l ";
			break;
		default:
			finalClass += "border-r ";
			break;
	}
	return finalClass;
});
</script>

<style>
.slide-fade-enter-active {
	transition: all 0.15s ease-out;
}

.slide-fade-leave-active {
	transition: all 0.15s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	@apply translate-x-full opacity-0;
}
</style>
