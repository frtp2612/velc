<template>
	<div :class="containerClass" class="rounded-lg border flex gap-4 px-4 py-2">
		<slot>
			<font-awesome :icon="icon" :class="iconClass" />
		</slot>
		<div class="flex flex-col gap-2">
			<p>{{ text }}</p>
			<slot name="additional-content"></slot>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
	text: string;
	icon?: string;
	iconWidth?: string;
	iconHeight?: string;
	iconClassOverride?: string;
	containerClassOverride?: string;
}>();

const iconClass = computed(() => {
	if (props.iconClassOverride) {
		return props.iconClassOverride;
	}

	let classes = [];
	classes.push(props.iconWidth ? props.iconWidth : "w-4");
	classes.push(props.iconHeight ? props.iconHeight : "h-4");

	return classes.join(" ");
});

const containerClass = computed(() => {
	if (props.iconClassOverride) {
		return props.iconClassOverride;
	}

	return "";
});
</script>
