<template>
	<Teleport to="body" :disabled="!isOpen">
		<div
			class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-color-bg-900/10"
			:class="[zOverride ? zOverride : 'z-[9999]']"
			v-if="isOpen"
		>
			<div
				class="border border-color-border-100 bg-color-bg rounded-lg flex flex-col"
				:style="windowSize"
				ref="window"
			>
				<section
					v-if="title || $slots.header"
					class="border-b border-color-border p-4 flex items-center gap-4"
				>
					<slot name="header">
						<VLabel class="text-xl font-semibold">
							{{ title }}
						</VLabel>
					</slot>
					<VButton
						icon-left="fa-xmark"
						:on-click="close"
						class="ml-auto rounded-md interactive-text interactive-bg"
					/>
				</section>

				<section class="p-6 h-full min-h-0 flex flex-col gap-4">
					<slot
						><component
							:is="rawComponent"
							v-if="contentComponent"
							v-bind="{ events: { close } }"
					/></slot>

					<slot name="footer"></slot>
				</section>
			</div>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
// import { onClickOutside, useVModel } from '@vueuse/core';
import VButton from "@/components/VButton/index";
import VLabel from "@/components/VLabel/index";
import { useVModel } from "@vueuse/core";
import { computed, markRaw, ref } from "vue";

const props = defineProps<{
	contentComponent?: Object;
	title?: string;
	width?: number | string;
	height?: number | string;
	zOverride?: string;
	modelValue?: boolean;
}>();

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
const window = ref<HTMLElement | null>(null);

// onClickOutside(window, () => (isOpen.value = false));

defineExpose<{
	open: () => void;
	close: () => void;
}>({ open, close });

function open() {
	isOpen.value = true;
}

function close() {
	isOpen.value = false;
}

const windowSize = computed(() => {
	let finalStyle = "";
	if (props.width) {
		finalStyle +=
			"width: " +
			(typeof props.width === "string" ? props.width : `${props.width}px`);
	}
	finalStyle += "; ";
	if (props.height) {
		finalStyle +=
			"height:" +
			(typeof props.height === "string" ? props.height : `${props.height}px`);
	}
	finalStyle += "; ";
	return finalStyle;
});

const rawComponent = props.contentComponent
	? markRaw(props.contentComponent)
	: undefined;
</script>
