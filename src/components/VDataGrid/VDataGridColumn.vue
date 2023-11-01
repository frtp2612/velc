<template>
	<div
		ref="column"
		class="flex flex-col relative border-r-theme-bg-100 border-r"
		:class="[data.locked ? 'bg-inherit' : ' ']"
		:style="data.locked ? lockedStyle : ''"
	>
		<div class="flex items-center gap-2 cursor-pointer" @click="sort(data.id)">
			<font-awesome-icon
				icon="fa-lock"
				class="w-3 h-3 text-theme-primary-600"
				v-if="data.locked"
			/>
			<VLabel class="overflow-hidden overflow-ellipsis whitespace-nowrap">{{
				data.label
			}}</VLabel>
			<div v-show="data.id === sortKey">
				<font-awesome-icon
					:icon="sortIcon"
					class="w-3 h-3 text-theme-primary-600"
				/>
			</div>
		</div>

		<div
			ref="gutter"
			class="absolute right-0 translate-x-2 px-2 top-0 w-1 before:content[''] before:absolute hover:before:bg-theme-primary/50 before:-z-[1] cursor-col-resize before:-mx-[5px] before:w-[11px] before:h-full before:transition-all before:ease-out before:duration-150 after:transition-all after:ease-out after:duration-150 after:content[''] after:absolute after:bg-theme-transparent after:h-8 after:w-[3px] after:-my-4 after:-mx-[1px] after:rounded after:top-1/2 hover:after:bg-theme-primary-600"
			:style="[{ height: state ? state.tableHeight.value + 'px' : '100%' }]"
		></div>
	</div>
</template>

<script setup lang="ts">
import VLabel from "@/components/VLabel/index";
import { useElementResizer } from "@/composables/UseElementResizer";
import { computed, inject, ref } from "vue";
import { VDataColumn, VDataGridStateType } from "./VDataGridTypes";

const props = defineProps<{
	data: VDataColumn;
	index: number;
}>();

const gutter = ref<HTMLElement | null>(null);
const column = ref<HTMLElement | null>(null);

const state: VDataGridStateType | undefined = inject("state");

const { lockedColumnsMap, sortKey, sortOrder, sort } = state!;

if (state) {
	useElementResizer(column, gutter, (width: number) =>
		state.updateColumnSize(props.data.id, width)
	);
}

const lockedStyle = computed(
	() =>
		`position: sticky; left:${lockedColumnsMap.value.get(
			props.data.id
		)}px; z-index:${100 - props.index}`
);

const sortIcon = computed(() =>
	sortOrder.value === "asc"
		? "fa-arrow-up-short-wide"
		: "fa-arrow-down-wide-short"
);
</script>
