<template>
	<div class="flex flex-col gap-2">
		<div class="flex items-center h-12 gap-1">
			<div
				class="p-2 aspect-square flex justify-center hover:bg-color-bg-100 rounded-lg cursor-pointer"
				@click="toggleSubMenu"
				v-if="hasChildren"
			>
				<font-awesome-icon
					:icon="subMenuOpen ? 'fa-angle-down' : 'fa-angle-right'"
					class="w-4 aspect-square"
				/>
			</div>

			<div
				class="flex gap-2 cursor-pointer items-center rounded-lg px-4 py-1 h-10 grow"
				:class="[
					isActive
						? 'bg-color-accent text-color-text-50'
						: 'bg-color-bg-50 hover:bg-color-bg-100',
				]"
				@click="nodeSelected(item)"
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
						@onNodeSelected="nodeSelected"
					/>
				</li>
			</ul>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { VTreeNodeType } from "./VTreeNodeTypes";

const props = defineProps<{
	item: VTreeNodeType;
	activeNode?: VTreeNodeType;
	formatter: (value: VTreeNodeType) => string;
}>();

const emit = defineEmits(["onNodeSelected"]);
const subMenuOpen = ref(false);

function toggleSubMenu() {
	subMenuOpen.value = !subMenuOpen.value;
}

function nodeSelected(node: VTreeNodeType) {
	emit("onNodeSelected", node);
}

const hasChildren = computed(
	() => props.item.children && props.item.children.length > 0
);

const formattedValue = computed(() => props.formatter(props.item));

const isActive = computed(() =>
	props.activeNode
		? JSON.stringify(props.activeNode) === JSON.stringify(props.item)
		: false
);
</script>
