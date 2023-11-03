<template>
	<div
		ref="column"
		class="flex flex-col relative border-r-theme-bg-100 border-r"
		:class="[data.locked ? 'bg-inherit z-[1]' : ' ']"
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
			class="absolute -right-[1px] top-0 w-2 group"
			v-show="allowResize"
		>
			<font-awesome-icon
				icon="fa-left-right"
				class="absolute w-3 h-3 top-1/2 right-0 translate-y-1.5 text-theme-text-inverted bg-theme-primary-200 group-hover:bg-theme-primary-600 p-1 rounded-l-full cursor-col-resize transition-all ease-in-out duration-150"
			/>

			<div
				class="absolute h-full w-[2px] left-1.5 transition-all ease-in-out duration-150 bg-theme-primary-200 group-hover:bg-theme-primary-600"
				:style="[{ height: state ? tableHeight + 'px' : '100%' }]"
			></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import VLabel from "@/components/VLabel/index";
import { useElementResizer } from "@/composables/UseElementResizer";
import { computed, inject, onMounted, onUnmounted, ref } from "vue";
import { VDataColumn, VDataGridStateType } from "./VDataGridTypes";

const props = defineProps<{
	data: VDataColumn;
	index: number;
}>();

const gutter = ref<HTMLElement | null>(null);
const column = ref<HTMLElement | null>(null);

const state: VDataGridStateType | undefined = inject("state");

const { tableHeight } = state!;

const { lockedColumnsMap, sortKey, sortOrder, sort } = state!;

const allowResize = ref(false);

if (state) {
	useElementResizer(column, gutter, (width: number) =>
		state.updateColumnSize(props.data.id, width)
	);
}

const lockedStyle = computed(
	() => `position: sticky; left:${lockedColumnsMap.value.get(props.data.id)}px;`
);

const sortIcon = computed(() =>
	sortOrder.value === "asc"
		? "fa-arrow-up-short-wide"
		: "fa-arrow-down-wide-short"
);

onMounted(() => {
	if (column.value) {
		column.value.addEventListener("mouseenter", toggleResize);
		column.value.addEventListener("mouseleave", toggleResize);
	}
});

onUnmounted(() => {
	if (column.value) {
		column.value.removeEventListener("mouseenter", toggleResize);
		column.value.removeEventListener("mouseleave", toggleResize);
	}
});

function toggleResize(event: MouseEvent) {
	if (event.type === "mouseenter") {
		allowResize.value = true;
	} else {
		allowResize.value = false;
	}
}
</script>
