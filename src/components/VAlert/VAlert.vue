<template>
	<div
		:class="containerClass"
		class="rounded-lg flex gap-4 px-3 py-3 items-center"
	>
		<font-awesome-icon :icon="iconName" :class="iconClass" v-if="iconName" />
		<div class="flex flex-col gap-2">
			<p>{{ text }}</p>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { MessageType } from "@/enums/index";
import { computed } from "vue";

const props = defineProps<{
	text: string;
	icon?: string;
	type: MessageType;
	iconWidth?: string;
	iconHeight?: string;
	iconClassOverride?: string;
	containerClassOverride?: string;
}>();

const iconName = computed(() => {
	if (props.icon) return props.icon;

	switch (props.type) {
		case MessageType.INFO:
			return "fa-lightbulb";
		case MessageType.ALERT:
			return "fa-exclamation";
		case MessageType.ERROR:
			return "fa-xmark";
		case MessageType.SUCCESS:
			return "fa-check";
		default:
			return undefined;
	}
});

const iconClass = computed(() => {
	if (props.iconClassOverride) {
		return props.iconClassOverride;
	}

	let classes = [];
	classes.push(props.iconWidth ? props.iconWidth : "w-4");
	classes.push(props.iconHeight ? props.iconHeight : "h-4");

	switch (props.type) {
		case MessageType.INFO:
			classes.push("text-color-text-50 bg-color-primary/80 rounded-full p-1");
			break;
		case MessageType.ALERT:
			classes.push("text-color-text-50 bg-color-alert/80 rounded-full p-1");
			break;
		case MessageType.ERROR:
			classes.push("text-color-text-50 bg-color-error/80 rounded-full p-1");
			break;
		case MessageType.SUCCESS:
			classes.push("text-color-text-50 bg-color-success/80 rounded-full p-1");
			break;
		default:
			break;
	}

	return classes.join(" ");
});

const containerClass = computed(() => {
	if (props.containerClassOverride) {
		return props.containerClassOverride;
	}

	switch (props.type) {
		case MessageType.INFO:
			return "gradient-info";
		case MessageType.ALERT:
			return "gradient-alert";
		case MessageType.SUCCESS:
			return "gradient-success";
		case MessageType.ERROR:
			return "gradient-error";
		default:
			return "gradient-normal";
	}
});
</script>
