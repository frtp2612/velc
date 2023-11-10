<template>
	<div class="flex flex-col gap-4 min-h-0 overflow-auto">
		<VTreeNode
			:item="root"
			:formatter="formatter"
			:activeNode="activeNode"
			@onNodeSelected="onNodeSelected"
			:onlyLeavesSelectable="onlyLeavesSelectable"
			v-if="!hideRoot"
		/>
		<ul
			class="flex flex-col gap-4"
			:class="[{ 'overflow-auto': hideRoot }]"
			v-else
		>
			<li v-for="item in root.children" :key="item.id">
				<VTreeNode
					:item="item"
					:formatter="formatter"
					:activeNode="activeNode"
					@onNodeSelected="onNodeSelected"
					:onlyLeavesSelectable="onlyLeavesSelectable"
				/>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { VTreeNodeType } from "@/enums";
import { useVModel } from "@vueuse/core";
import VTreeNode from "./VTreeNode.vue";

const props = withDefaults(
	defineProps<{
		root: VTreeNodeType;
		modelValue?: VTreeNodeType;
		formatter: (value: VTreeNodeType) => string;
		hideRoot?: boolean;
		onlyLeavesSelectable?: boolean;
	}>(),
	{
		onlyLeavesSelectable: false,
	}
);

const emit = defineEmits(["nodeSelected", "update:modelValue"]);
const activeNode = useVModel(
	props,
	"modelValue",
	emit,
	props.modelValue
		? {}
		: {
				passive: true,
		  }
);

function onNodeSelected(node: VTreeNodeType) {
	activeNode.value = node;

	emit("nodeSelected", node);
}
</script>
