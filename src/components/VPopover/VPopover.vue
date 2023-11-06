<template>
	<div ref="popover" class="inline-block">
		<slot :events="{ toggle }"
			><p @mouseenter="toggle" @mouseleave="toggle">Popover</p></slot
		>
		<Teleport to="body">
			<div v-show="open" ref="container">
				<div
					class="w-3 h-3 absolute mt-0 top-0 left-0 bg-color-bg rotate-45 border-t border-l border-color-border-100 -mx-1.5 z-30"
					ref="arrow"
				></div>
				<div
					class="absolute z-20 mt-1.5 shadow-md shadow-color-bg-100 top-full flex flex-col gap-2 bg-color-bg border border-color-border-100 rounded-lg p-4 w-max max-w-max text-center"
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

const open = ref(false);

const popover = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);
const arrow = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);

onClickOutside(container, () => (open.value = false));

function toggle() {
	open.value = !open.value;
	if (open.value) {
		if (
			popover.value !== null &&
			content.value !== null &&
			arrow.value !== null
		) {
			requestAnimationFrame(() =>
				useAutoPopDirection(popover.value!, content.value!, arrow.value!)
			);
		}
	}
}
// TODO to improve customization, pass arrow styles as props
</script>
