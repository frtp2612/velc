<template>
	<div
		class="flex flex-col h-full min-h-0 gap-4 bg-color-bg p-4 border border-color-border-50 transition-all ease-out duration-200"
		:class="[isExpanded ? 'w-96' : 'w-[calc(2px+4.5rem)]']"
	>
		<slot name="topNav">
			<div
				class="flex w-full"
				:class="[
					isExpanded
						? 'self-start justify-between'
						: 'self-center flex-col gap-4 items-start',
				]"
			>
				<div
					class="p-2 w-[2.5rem] rounded-lg border border-color-border aspect-square flex justify-center cursor-pointer"
				>
					<slot name="logo"
						><span class="font-bold text-color-primary">V</span></slot
					>
				</div>
				<div class="self-center">
					<VButton
						:on-click="() => (isExpanded = !isExpanded)"
						icon-left="fa-bars-staggered"
						v-tooltip:right="{ text: 'Toggle navigation' }"
					>
					</VButton>
				</div>
			</div>
		</slot>
		<VDivider />
		<VLabel
			class="text-color-text-300 font-bold text-sm transition-opacity ease-out"
			v-show="isExpanded"
			:class="[isExpanded ? 'opacity-100' : 'opacity-0']"
			>Menu</VLabel
		>
		<div class="overflow-auto min-h-0 grid gap-4 w-full">
			<VNavigationNode
				v-for="node in root.children"
				:data="node"
				:isExpanded="isExpanded"
				v-model="selectedNode"
			/>
		</div>
		<VDivider />
		<div v-if="$slots.bottomNav" class="flex flex-col gap-4 w-full">
			<slot name="bottomNav" :isExpanded="isExpanded"></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import VDivider from "@/components/VDivider/index";
import VLabel from "@/components/VLabel/VLabel.vue";
import { VNavItem } from "@/enums/index";
import { useVModel } from "@vueuse/core";
import { VNavigationNode } from ".";
import VButton from "../VButton/index";

const props = defineProps<{
	root: VNavItem;
	modelValue?: string;
	expanded?: boolean;
}>();

const emit = defineEmits(["update:modelValue", "update:expanded"]);

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

const isExpanded = useVModel(
	props,
	"expanded",
	emit,
	props.expanded
		? {}
		: {
				passive: true,
				defaultValue: false,
		  }
);
</script>

<style scoped></style>
