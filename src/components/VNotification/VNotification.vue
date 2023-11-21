<template>
	<div
		class="fixed top-0 left-0 w-screen h-screen bg-black/5 grid grid-rows-1 grid-cols-1 justify-center items-start p-8 z-[999999]"
		v-if="isOpen"
	>
		<div
			class="bg-color-bg border border-color-border-50 rounded-lg p-8 w-1/3 mx-auto flex flex-col gap-4"
		>
			<div class="flex justify-between gap-4 items-center">
				<slot name="title"
					><VLabel
						class="text-xl font-semibold flex gap-4 items-center"
						v-if="title"
					>
						<div
							class="flex border-2 rounded-full aspect-square"
							v-if="icon"
							:class="iconColor"
						>
							<font-awesome-icon :icon="icon" class="h-4 w-4 p-1" />
						</div>
						{{ title }}</VLabel
					></slot
				>
				<VButton
					icon-left="fa-xmark"
					class="ml-auto"
					:on-click="close"
				></VButton>
			</div>
			<div class="overflow-auto max-h-96">
				<slot>
					<VLabel>{{ description }}</VLabel>
				</slot>
			</div>
			<VButton :on-click="close">Close</VButton>
		</div>
	</div>
</template>

<script lang="ts" setup>
import VLabel from "@/components/VLabel/VLabel.vue";
import { useVModel } from "@vueuse/core";
import { computed } from "vue";
import { MessageType } from "../../enums/index";
import VButton from "../VButton/index";

const props = withDefaults(
	defineProps<{
		title?: string;
		description?: string;
		modelValue: boolean;
		type?: MessageType;
	}>(),
	{
		type: MessageType.NORMAL,
	}
);

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

const icon = computed(() => {
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

const iconColor = computed(() => {
	switch (props.type) {
		case MessageType.INFO:
			return "text-color-primary border-color-primary";
		case MessageType.ALERT:
			return "text-color-alert border-color-alert";
		case MessageType.ERROR:
			return "text-color-error border-color-error";
		case MessageType.SUCCESS:
			return "text-color-success border-color-success";
		default:
			return "text-color-text border-color-border-50";
	}
});

function close() {
	isOpen.value = false;
}
</script>
