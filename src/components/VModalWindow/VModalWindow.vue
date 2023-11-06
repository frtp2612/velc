<template>
	<div
		class="fixed top-0 left-0 z-[9999] w-full h-full flex items-center justify-center bg-color-bg-900/10"
		v-if="isOpen"
	>
		<div
			class="border border-color-border-100 bg-color-bg p-4 rounded-lg"
			ref="window"
		>
			<slot name="header"></slot>
			<slot
				><component :is="rawComponent" v-if="contentComponent"></component
			></slot>
			<slot name="footer"></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { markRaw, ref } from "vue";

const props = defineProps<{
	contentComponent?: Object;
}>();

const window = ref<HTMLElement | null>(null);
const isOpen = ref(false);

onClickOutside(window, () => (isOpen.value = false));

defineExpose<{
	open: () => void;
}>({ open });

function open() {
	isOpen.value = true;
}

const rawComponent = props.contentComponent
	? markRaw(props.contentComponent)
	: undefined;
</script>
