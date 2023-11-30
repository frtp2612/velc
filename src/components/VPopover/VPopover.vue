<template>
	<div ref="popover" class="inline-block">
		<slot :events="{ toggle, open, close }" :attributes="{ isOpen }"
			><p @mouseenter="open" @mouseleave="close">Popover</p></slot
		>
		<Teleport to="body" :disabled="!isOpen">
			<div
				v-show="isOpen"
				ref="container"
				class="absolute top-0 left-0 p-2 z-[10000]"
			>
				<div class="arrow" ref="arrow"></div>
				<div
					class="z-20 p-6 overlay-element min-w-min max-w-max text-center"
					ref="content"
				>
					<slot name="content"><span>Default popover content</span></slot>
				</div>
			</div>
		</Teleport>
	</div>
</template>

<script lang="ts" setup>
import { useAutoPopDirection } from "@/composables/UseAutoPopDirection";
import { onClickOutside } from "@vueuse/core";
import { ref } from "vue";

const isOpen = ref(false);

const popover = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);
const arrow = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);

onClickOutside(
	container,
	() => {
		isOpen.value = false;
	},
	{
		ignore: [popover],
	}
);

function open() {
	isOpen.value = true;
	if (
		popover.value !== null &&
		container.value !== null &&
		content.value !== null &&
		arrow.value !== null
	) {
		useAutoPopDirection(
			popover.value,
			container.value,
			content.value,
			arrow.value
		);
	}
}

function close() {
	isOpen.value = false;
}

function toggle() {
	if (isOpen.value) {
		close();
	} else {
		open();
	}
}

defineExpose({ open, close });
// TODO to improve customization, pass arrow styles as props
</script>
