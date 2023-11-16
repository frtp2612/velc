<template>
	<div class="flex flex-col h-full min-h-0 gap-4 bg-color-bg p-4">
		<slot name="topNav">
			<div
				class="self-center p-2 w-12 rounded-lg border border-color-border aspect-square flex items-center justify-center cursor-pointer"
			>
				<slot name="logo"
					><span class="font-bold text-color-primary">V</span></slot
				>
			</div>
		</slot>
		<VDivider />
		<VLabel class="text-color-text-300 font-bold text-sm">Menu</VLabel>
		<div class="overflow-auto min-h-0 h-full flex flex-col gap-4 w-full">
			<VNavigationNode
				v-for="node in root.children"
				:data="node"
				v-model="selectedNode"
			/>
		</div>
		<VDivider />
		<div v-if="$slots.bottomNav" class="flex flex-col gap-4 w-full">
			<slot name="bottomNav"></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import VDivider from "@/components/VDivider/index";
import VLabel from "@/components/VLabel/VLabel.vue";
import { VNavItem } from "@/enums/index";
import { useVModel } from "@vueuse/core";
import { VNavigationNode } from ".";

const props = defineProps<{
	root: VNavItem;
	modelValue?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const selectedNode = useVModel(
	props,
	"modelValue",
	emit,
	props.modelValue
		? {}
		: {
				passive: true,
				defaultValue: "",
		  }
);
</script>

<style scoped></style>
