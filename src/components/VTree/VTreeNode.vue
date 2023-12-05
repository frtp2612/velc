<template>
	<div class="flex flex-col gap-2">
		<div class="flex items-center gap-1">
			<VButton
				:on-click="toggleSubMenu"
				v-if="hasChildren"
				class="!min-w-[2rem] !min-h-[2rem]"
			>
				<font-awesome-icon
					:icon="subMenuOpen ? 'fa-angle-down' : 'fa-angle-right'"
					class="w-4 aspect-square"
				/>
			</VButton>

			<div
				class="flex gap-2 cursor-pointer items-center rounded-lg px-4 py-1 h-10 grow"
				:class="[nodeClass]"
				@click="isSelectable ? nodeSelected(item) : toggleSubMenu()"
			>
				<span class="grow" :class="[isActive ? 'font-semibold' : '']">{{
					formattedValue
				}}</span>
			</div>
		</div>
		<template v-if="hasChildren">
			<ul v-show="subMenuOpen" class="pl-9 flex flex-col gap-2">
				<li v-for="subItem in item.children" :key="subItem.id">
					<VTreeNode
						:item="subItem"
						:formatter="formatter"
						:active-node="activeNode"
						:only-leaves-selectable="onlyLeavesSelectable"
						@onNodeSelected="nodeSelected"
					/>
				</li>
			</ul>
		</template>
	</div>
</template>

<script setup lang="ts">
import VButton from "@/components/VButton/index";
import { VTreeNodeType } from "@/enums";
import { flattenData } from "@/utilities/index";
import { computed, ref } from "vue";

const props = defineProps<{
	item: VTreeNodeType;
	activeNode?: VTreeNodeType | null;
	formatter: (value: VTreeNodeType) => string;
	onlyLeavesSelectable: boolean;
}>();

const emit = defineEmits(["onNodeSelected"]);

function treeNodeIsSelected(): boolean {
	return (
		(props.activeNode &&
			props.item.children &&
			!props.onlyLeavesSelectable &&
			flattenData(props.item.children)
				.map((child: VTreeNodeType) => JSON.stringify(child))
				.includes(JSON.stringify(props.activeNode))) ||
		false
	);
}

const subMenuOpen = ref(treeNodeIsSelected());

function toggleSubMenu() {
	subMenuOpen.value = !subMenuOpen.value;
}

function nodeSelected(node: VTreeNodeType) {
	emit("onNodeSelected", node);
}

const hasChildren = computed(
	() => props.item.children && props.item.children.length > 0
);

const isSelectable = computed(
	() => !hasChildren.value || (hasChildren.value && !props.onlyLeavesSelectable)
);

const nodeClass = computed(() => {
	let finalClass = " ";
	if (isActive.value) {
		finalClass += "bg-color-primary text-color-text-50";
	} else {
		finalClass += isSelectable.value
			? "hover:bg-color-bg-50 hover:text-color-primary"
			: "text-color-text-600 hover:text-color-text";
	}

	return finalClass;
});

const formattedValue = computed(() => props.formatter(props.item));

const isActive = computed(() =>
	props.activeNode
		? JSON.stringify(props.activeNode) === JSON.stringify(props.item)
		: false
);
</script>
