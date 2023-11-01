<template>
	<div
		class="flex flex-col border bg-theme-bg border-theme-bg-200 min-h-0 min-w-0 h-full w-full overflow-auto"
	>
		<div class="relative min-h-0 flex flex-col" ref="tableContainer">
			<!--GRID LEADING CONTENT-->

			<!-- GRID CONTENT -->
			<VirtualScroller
				:item-height="32"
				:items="data"
				:wrapper-class="initialized ? 'w-fit' : ''"
			>
				<template #prepend>
					<!-- GRID HEADER -->
					<div
						class="grid sticky top-0 bg-theme-bg-50 z-10 border-b"
						:class="{ 'w-fit': initialized }"
						:style="{
							gridTemplateColumns: columnsLayout || columnsGridLayout,
						}"
						ref="columnsContainer"
					>
						<VDataGridColumn
							v-for="(column, index) in columns"
							:data="column"
							:index="index"
							class="px-3 leading-[32px]"
						/>
					</div>
				</template>
				<!-- GRID ROWS -->
				<template v-slot="{ item }">
					<VDataGridRow
						:data="item"
						:style="{
							gridTemplateColumns: columnsLayout || columnsGridLayout,
						}"
					/>
				</template>
			</VirtualScroller>

			<!--GRID TRAILING CONTENT-->
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, provide, ref } from "vue";
import VirtualScroller from "../VirtualScroller/VirtualScroller.vue";
import VDataGridColumn from "./VDataGridColumn.vue";
import VDataGridRow from "./VDataGridRow.vue";
import VDataGridState from "./VDataGridState";
import { VDataColumn, VDataRow } from "./VDataGridTypes";

const props = defineProps<{
	columns: Array<VDataColumn>;
	rows: Array<VDataRow>;
	defaultSortKey?: string;
	defaultSortDirection?: string;
}>();

const columnsGridLayout = computed(
	() => `repeat(${props.columns.length}, 1fr)`
);

const state = VDataGridState(
	ref(props.rows),
	props.columns,
	props.defaultSortKey,
	props.defaultSortDirection
);

const { initialized, columnsLayout, data } = state;

const tableContainer = ref<HTMLElement | null>(null);
const columnsContainer = ref<HTMLElement | null>(null);

provide("state", state);

onMounted(() => {
	if (tableContainer.value !== null && columnsContainer.value !== null) {
		state.init(tableContainer.value, columnsContainer.value);
	}
});
</script>
